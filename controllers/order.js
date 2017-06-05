'use strict';

const crypto = require('crypto');
const _ = require('lodash');
const moment = require('moment');

const utils = require('../utils');
const constants = require('../constants');
const shipCompliant = require('../lib/ship_compliant');
const shopify = require('../lib/shopify');
const models = require('../lib/postgres').models;
const Shop = models.shop;
const Order = models.order;

module.exports.listOrders = async ctx => {
  const {
    sort = 'created_at',
    order = 'DESC',
    limit = 50,
    offset = 0
  } = ctx.request.query;
  if (!['ASC', 'DESC'].includes(order)) {
    return ctx.respond(400, 'Query parameter `order` must be "ASC" or "DESC"');
  }
  const shopId = ctx.session.shop_id;
  const orders = await Order.findAll({
    where: { shop_id: shopId },
    order: [[sort, order], ['created_at', 'DESC']],
    limit: limit,
    offset: offset
  });

  return ctx.respond(200, orders);
};

// Cron endpoint
module.exports.syncOrders = async ctx => {
  if (!ctx.request.headers['X-Appengine-Cron'] && !ctx.session.shop_id) {
    return ctx.respond(401, 'Unauthorized');
  }

  const scClientsMap = {};

  const unfulfilled = await Order.findAll({
    where: { status: { $in: [ null, 'InProcess', 'PaymentAccepted', 'SentToFulfillment' ] } },
    order: [['shop_id', 'ASC']]
  });

  for (const order of unfulfilled) {
    try {
      if (!scClientsMap[order.shop_id]) {
        const shop = await Shop.findById(order.shop_id);
        scClientsMap[order.shop_id] = await shipCompliant.createClient(shop.sc_username, shop.sc_password);
      }
      const scClient = scClientsMap[order.shop_id];
      const scOrder = await scClient.getSalesOrder(order.order_key);

      if ((scOrder.status !== order.status) || (scOrder.tracking.length > order.tracking_numbers.length)) {
        order.status = scOrder.status;
        order.tracking_numbers = scOrder.tracking;
        order.shipping_service = scOrder.shipping_service;
        order.save();

        if (order.tracking_numbers.length) {
          shopify.syncFulfillments(order);
        }
      }
    } catch (e) {
      console.error(`Error syncing order ${order.order_key}`);
      console.error(e);
    }
  }

  return ctx.respond(200, 'Successfully synced');
};


// Shopify Webhook Endpoint
module.exports.createOrder = async ctx => {
  try {
    const {
      'x-shopify-shop-domain': myshopifyDomain,
      'x-shopify-hmac-sha256': hmac
    } = ctx.request.headers;

    // Authenticate webhook request
    const verify = crypto.createHmac('sha256', String(process.env.API_SECRET));
    const signature = verify.update(ctx.request.rawBody).digest('base64');
    if (hmac !== signature) {
      return ctx.respond(401, 'Unauthorized');
    }
    ctx.respond(200, 'Successful');

    const shopifyOrder = ctx.request.body;
    [shopifyOrder.line_items, shopifyOrder.total_tax] = cleanLineItems(
      shopifyOrder.line_items
    );

    const shop = await Shop.findOne({
      where: { myshopify_domain: myshopifyDomain }
    });
    const compliances = await shop.getCompliance({
      where: { state: shopifyOrder.shipping_address.province_code }
    });
    if (!compliances.length) {
      console.error();
    }
    const compliance = compliances[0];

    const order = await Order.create({
      shop_id: shop.id,
      cart_total: shopifyOrder.total_price,
      currency: shopifyOrder.currency,
      tax_total: shopifyOrder.total_tax,
      tax_value: shopifyOrder.total_tax,
      order_key: shopifyOrder.id,
      shopify_order_no: shopifyOrder.name,
      location_state: shopifyOrder.shipping_address.province_code,
      location_zip: shopifyOrder.shipping_address.zip,
      compliant: compliance.compliant,
      override: compliance.override,
      ordered_at: Date.now(),
      status: 'PaymentAccepted',
    });

    if (compliance.compliant || compliance.override === 'auto') {
      const scClient = await shipCompliant.createClient(
        shop.sc_username,
        shop.sc_password
      );
      if (!scClient) {
        throw 'Cannot connect to ShipCompliant';
      }
      const result = await scClient.checkComplianceAndCommitSalesOrder(
        shopifyOrder
      );
      if (result.error) {
        console.error(
          `Error committing sales order ${shopifyOrder.id} with ShipCompliant at ${moment().toISOString()}`
        );
      }

      order.success = result.success;
    } else {
      // Currently an edge case
      order.success = false;
      order.compliant = false;
      // "QUARANTINE" ORDER
      // SEND NOTIFICATION
    }

    await order.save();
  } catch (e) {
    console.error(e.Fault || e);
  }
};

// convert child line items into top level items
function cleanLineItems (lineItems) {
  const items = [];
  let tax;
  for (let item of lineItems) {
    // if there are child items (bundle)
    if (_.get(item, 'properties.length')) {
      let price = item.price;
      for (let child of item.properties) {
        if (child.name === 'Recurring Order') {
          continue;
        }
        items.push({
          price,
          sku: /SKU:\s([a-zA-Z0-9]*)/i.exec(child.value)[1].trim(),
          vendor: /Vendor:\s([a-zA-Z0-9]*)/i.exec(child.value)[1].trim() ||
            item.vendor,
          quantity: Number(/Quantity:\s([0-9]*)/i.exec(child.value)[1].trim())
        });
        price = '0.00';
      }
      // if tax line item
    } else if (item.sku === 'TAX') {
      tax = item.price;
      // if not bundle
    } else {
      items.push(item);
    }
  }
  return [items, tax];
}
