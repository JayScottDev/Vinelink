const request = require('request-promise');
const _ = require('lodash');

const models = require('./postgres').models;
const Shop = models.shop;
const webhooks = require('../config/shopify_webhooks').webhooks;

const apiPrefix = `https://${process.env.APP_URL}`;

// Register webhooks
module.exports.registerWebhooks = async () => {
  const shops = await Shop.findAll();
  for (let shop of shops) {
    try {
      const { webhooks: existing } = await shopifyRequest(shop, 'GET', 'admin/webhooks');
      for (let webhook of webhooks) {
        const address = `${apiPrefix}/${webhook.path}`;
        if (!existing.some( ex => (ex.topic === webhook.topic) && (ex.address === address) )) {
          const resp = await shopifyRequest(shop, 'POST', 'admin/webhooks', {
            webhook: {
              address,
              topic: webhook.topic,
              format: 'json'
            }
          });
        }
      }
      console.log('Shopify Webhooks registered');
    } catch (e) {
      console.error(`Unable to register webhooks for ${shop.shopify_shop_name}`);
      console.error(Object.keys(e));
      console.error(e.response.body);
    }
  }
};

// Updates order status and tracking
module.exports.syncFulfillments = async (order) => {
  const shop = await Shop.findById(order.shop_id);
  let fulfillStatus = null;

  const shopifyFulfillments = await shopifyRequest(shop, 'GET', `admin/orders/${order.order_key}/fulfillments`);
  let fulfillmentId;
  if (!_.get(shopifyFulfillments, 'fulfillments.length')) {
    const reqBody = { fulfillment: {
      tracking_numbers: order.tracking_numbers,
      tracking_company: order.shipping_service
    }};
    const resp = await shopifyRequest(shop, 'POST', `admin/orders/${order.order_key}/fulfillments`, reqBody);
    fulfillmentId = resp.fulfillment.id;
  } else {
    fulfillmentId = shopifyFulfillments.fulfillments[0].id;
  }

  order.shopify_fulfillment_id = fulfillmentId;
  order.save();
  return;
};

async function shopifyRequest (shop, method, path, body) {
  const reqOpts = {
    method,
    uri: `https://${shop.myshopify_domain}/${path}.json`,
    headers: {
      'X-Shopify-Access-Token': shop.shopify_access_token
    },
    json: true,
    body
  };
  try {
    return await request(reqOpts);
  } catch (e) {
    console.error(`Shopify request error for ${shop.myshopify_domain}`);
    console.error(reqOpts);
    console.error(e.stack);
    return null
  }
}
