'use strict';

const request = require('request-promise')
const moment = require('moment');
const Sequelize = require('sequelize');

const zipToState = require('../lib/zip_to_state');
const models = require('../lib/postgres').models;
const getSalesTax = require('../shipcompliantmethods.js').getSalesTax
const Shop = models.shop;
const ShopCompliance = models.shop_compliance;
const ComplianceLog = models.compliance_log;

module.exports.checkOrderCompliance = async (ctx, next) => {
  const domain = ctx.header.origin.split('/')[2]
  const { zip, total } = ctx.request.body;

  if (!zip || !total) {
    return ctx.respond(400, 'Missing required body parameter(s)');
  }

  const state = await zipToState(zip);
  if (!state) {
    return ctx.respond(404, 'State could not be found from zip code');
  }

  const shop = await Shop.findOne({domain});
  if (!shop) {
    return ctx.respond(404, 'Shop by that ID not found');
  }
  const shopId = shop.dataValues.shopify_shop_id

  // const compliances = await shop.getCompliance({ where: { state } });
  // if (!compliances.length) {
  //   return ctx.respond(500, 'Compliance for this shop and state not found.');
  // }
  //
  // const compliance = compliances[0];

  let taxPercent;
  let taxValue;
  // if (compliance.compliant || compliance.override) {
  const taxReq = {
    Request: {
      Security: {
        PartnerKey: '',
        Password: process.env.SC_PASSWORD,
        Username: process.env.SC_USER,
      },
      Address: {
        Zip1: zip,
      },
      TaxSaleType: 'Offsite'
    }
  };

  const tax = await getSalesTax(taxReq)
  const taxPerectange = tax.GetSalesTaxRatesByAddressResult.TaxRates.WineSalesTaxPercent
  const totalAfterTax = (taxPerectange * 0.01) * (total * .01);

  // }

  // const log = await ComplianceLog.create({
  //   shop_id: shopId,
  //   cart_total: total,
  //   compliant: true, //compliance.compliant,
  //   override: false, //compliance.override,
  //   tax_percent: taxPercent,
  //   tax_value: taxValue,
  //   location_state: state,
  //   location_zip: zip,
  //   checked_at: Date.now()
  // });


  const createProduct = await request({
    method: 'POST',
    url: 'https://ship-compliant-dev.myshopify.com/admin/products.json',
    headers: {
      'X-Shopify-Access-Token': ctx.session.access_token,
    },
    json: true,
    body: {
      product: {
        title: 'Compliancy Fee',
        body_html: '<strong>Compliancy Fee<\/strong>',
        vendor: 'NA',
        product_type: 'FEE',
        variants: [
         {
           option1: 'State Name',
           price: afterTax,
           sku: '123'
         }
        ]
      }
    }
  })

  const variantID = createProduct.product.variants[0].id
  ctx.body = {
    id: variantID
  }
  await next()

};

module.exports.getComplianceLogs = async ctx => {
  const { sort = 'created_at', order = 'DESC', limit = 50, offset = 0 } = ctx.request.query;
  if (!['ASC', 'DESC'].includes(order)) {
    return ctx.respond(400, 'Query parameter `order` must be "ASC" or "DESC"');
  }

  // TODO: get shopId
  const shopId = 1; // TEST ONLY
  const logs = await ComplianceLog.findAll({
    where: { shop_id: shopId },
    order: [[sort, order], ['created_at', 'DESC']],
    limit: limit,
    offset: offset
  });
  return ctx.respond(200, logs);
};

module.exports.logsReportByState = async ctx => {
  // TODO: Timespan
  const { sort = 'compliant_cart_total', order = 'DESC', limit = 10, offset = 0 } = ctx.request.query;
  const orders = ['ASC', 'DESC'];
  if (!orders.includes(order)) {
    return ctx.respond(400, `Query parameter "order" must be one of ${JSON.stringify(orders)}`);
  }
  const sorts = ['compliant_cart_total', 'noncompliant_cart_total', 'compliant_count', 'noncompliant_count'];
  if (!sorts.includes(sort)) {
    return ctx.respond(400, `Query parameter "sort" must be one of ${JSON.stringify(sorts)}`);
  }

  // TODO: get shopId
  const shopId = 1; // TEST ONLY

  // generate report of aggregate logs by state
  const report = await ComplianceLog.findAll({
    where: { shop_id: shopId },
    group: ['location_state'],
    attributes: [
      'location_state',
      [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN ("compliant" = true OR NOT ("override" IS NULL)) THEN "cart_total" END')), 'compliant_cart_total'],
      [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN ("compliant" = false AND ("override" IS NULL)) THEN "cart_total" END')), 'noncompliant_cart_total'],
      [Sequelize.fn('COUNT', Sequelize.literal('CASE WHEN ("compliant" = true OR NOT ("override" IS NULL)) THEN "location_state" END')), 'compliant_count'],
      [Sequelize.fn('COUNT', Sequelize.literal('CASE WHEN ("compliant" = false AND ("override" IS NULL)) THEN "location_state" END')), 'noncompliant_count'],
    ],
    order: [[Sequelize.literal(`"${sort}"`), order]],
    limit: limit,
    offset: offset
  });

  return ctx.respond(200, report);
};

module.exports.logsReportByDate = async ctx => {
  // TODO: timespan
  const { order = 'DESC', limit = 90, offset = 0 } = ctx.request.query;
  if (!['ASC', 'DESC'].includes(order)) {
    return ctx.respond(400, 'Query parameter `order` must be "ASC" or "DESC"');
  }

  // TODO: get shopId
  const shopId = 1; // TEST ONLY

  // generate report of aggregate logs by date (for graphing)
  const report = await ComplianceLog.findAll({
    where: { shop_id: shopId },
    group: [Sequelize.literal('1')],
    attributes: [
      [Sequelize.fn('date_trunc', 'day', Sequelize.col('checked_at')), 'checked_day'],
      [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN ("compliant" = true OR NOT ("override" IS NULL)) THEN "cart_total" END')), 'compliant_cart_total'],
      [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN ("compliant" = false AND ("override" IS NULL)) THEN "cart_total" END')), 'noncompliant_cart_total'],
      [Sequelize.fn('COUNT', Sequelize.literal('CASE WHEN ("compliant" = true OR NOT ("override" IS NULL)) THEN date_trunc(\'day\', "checked_at") END')), 'compliant_count'],
      [Sequelize.fn('COUNT', Sequelize.literal('CASE WHEN ("compliant" = false AND ("override" IS NULL)) THEN date_trunc(\'day\', "checked_at") END')), 'noncompliant_count'],
    ],
    order: [[Sequelize.literal('1'), order]],
    limit: limit,
    offset: offset
  });

  return ctx.respond(200, report);
};

module.exports.logsAggregateTotal = async ctx => {
  const { start = moment().subtract(90, 'days').toDate(), end = moment().toDate() } = ctx.request.query;

  // TODO: get shopId
  const shopId = 1; // TEST ONLY

  const report = await ComplianceLog.findOne({
    where: {
      shop_id: shopId,
      checked_at: {
        $between: [start, end]
      }
    },
    group: [Sequelize.col('shop_id')],
    attributes: [
      [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN ("compliant" = true OR NOT ("override" IS NULL)) THEN "cart_total" END')), 'compliant_cart_total'],
      [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN ("compliant" = false AND ("override" IS NULL)) THEN "cart_total" END')), 'noncompliant_cart_total'],
      [Sequelize.fn('COUNT', Sequelize.literal('CASE WHEN ("compliant" = true OR NOT ("override" IS NULL)) THEN "shop_id" END')), 'compliant_count'],
      [Sequelize.fn('COUNT', Sequelize.literal('CASE WHEN ("compliant" = false AND ("override" IS NULL)) THEN "shop_id" END')), 'noncompliant_count'],
    ]
  });

  return ctx.respond(200, report);
};

module.exports.generateLogExport = async ctx => {
  // TODO: get shopId
  const shopId = 1; // ctx.session.shop_id; // FOR TEST ONLY
  const { start_at: start, end_at: end } = ctx.request.body;

  generateAndEmailLogExport(shopId, start, end);
  return ctx.respond(200, 'Export process started.');
};

async function generateAndEmailLogExport (shopId, start, end) {
  // TODO: Generate CSV file
  // TODO: Upload file to cloud
  // TODO: Generate download link
  // TODO: Send link via email
}
