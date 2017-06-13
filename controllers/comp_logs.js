'use strict';

const request = require('request-promise');
const moment = require('moment');
const Sequelize = require('sequelize');
const _ = require('lodash');
const json2csv = require('json2csv');
const uuid = require('uuid/v4');

const gcs = require('@google-cloud/storage')({
  projectId: process.env.GCS_PROJECT_ID,
  keyFilename: process.env.GCS_KEYFILE
});

const zipToState = require('../lib/zip_to_state');
const email = require('../lib/email');
const models = require('../lib/postgres').models;
const shipCompliant = require('../lib/ship_compliant');
const Shop = models.shop;
const ShopCompliance = models.shop_compliance;
const ComplianceLog = models.compliance_log;

module.exports.checkOrderCompliance = async (ctx, next) => {
  const domain = ctx.header.origin.split('/')[2];
  const { zip, total } = ctx.request.body;
  ctx.response.set('Access-Control-Allow-Origin', '*');
  if (!zip || !total) {
    return ctx.respond(400, 'Missing required body parameter(s)');
  }

  const state = await zipToState(zip);
  if (!state) {
    return ctx.respond(200, { validZip: false });
  }

  const shop = await Shop.findOne({
    where: {
      $or: [{ myshopify_domain: domain }, { custom_domain: domain }]
    }
  });
  if (!shop) {
    return ctx.respond(404, 'Shop by that ID not found');
  }
  const shopId = shop.id;
  const accessToken = shop.shopify_access_token;
  const shopDomain = shop.myshopify_domain;
  const scUser = shop.sc_username;
  const scPass = shop.sc_password;

  const compliances = await shop.getCompliance({ where: { state } });
  if (!compliances.length) {
    return ctx.respond(500, 'Compliance for this shop and state not found.');
  }

  const compliance = compliances[0];

  if (!compliance.compliant && !compliance.override) {
    const log = await ComplianceLog.create({
      shop_id: shopId,
      cart_total: total,
      compliant: compliance.compliant,
      override: compliance.override,
      tax_percent: 0,
      tax_value: 0,
      location_state: state,
      location_zip: zip,
      checked_at: Date.now()
    });

    return ctx.respond(200, { compliant: false });
  }

  const scClient = await shipCompliant.createClient(
    shop.sc_username,
    shop.sc_password
  );

  const tax = await scClient.getTax(zip);
  const totalTax = tax * 0.01 * (total * 0.01);

  const log = await ComplianceLog.create({
    shop_id: shopId,
    cart_total: total,
    compliant: compliance.compliant,
    override: compliance.override,
    tax_percent: tax,
    tax_value: totalTax,
    location_state: state,
    location_zip: zip,
    checked_at: Date.now()
  });

  const createProduct = await request({
    method: 'POST',
    url: `https://${shopDomain}/admin/products.json`,
    headers: {
      'X-Shopify-Access-Token': accessToken
    },
    json: true,
    body: {
      product: {
        title: 'State Wine Tax',
        body_html: '<strong>State Wine Tax<\/strong>',
        vendor: 'VINELINK',
        product_type: 'FEE',
        images: [
          {
            src: 'https://cdn.shopify.com/s/files/1/2021/4773/files/Vector_Smart_Object_copy.png?2879857385645178993'
          }
        ],
        variants: [
          {
            option1: `${state}`,
            price: totalTax,
            sku: 'TAX'
          }
        ]
      }
    }
  });
  const variantID = createProduct.product.variants[0].id;
  ctx.body = {
    id: variantID
  };
  ctx.respond(200, { id: variantID, compliant: true });
};

module.exports.getComplianceLogs = async ctx => {
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
  const {
    sort = 'compliant_cart_total',
    order = 'DESC',
    limit = 10,
    offset = 0
  } = ctx.request.query;
  const orders = ['ASC', 'DESC'];
  if (!orders.includes(order)) {
    return ctx.respond(
      400,
      `Query parameter "order" must be one of ${JSON.stringify(orders)}`
    );
  }
  const sorts = [
    'compliant_cart_total',
    'noncompliant_cart_total',
    'compliant_count',
    'noncompliant_count'
  ];
  if (!sorts.includes(sort)) {
    return ctx.respond(
      400,
      `Query parameter "sort" must be one of ${JSON.stringify(sorts)}`
    );
  }

  const shopId = ctx.session.shop_id;

  // generate report of aggregate logs by state
  const report = await ComplianceLog.findAll({
    where: { shop_id: shopId },
    group: ['location_state'],
    attributes: [
      'location_state',
      [
        Sequelize.fn(
          'SUM',
          Sequelize.literal(
            'CASE WHEN ("compliant" = true OR NOT ("override" IS NULL)) THEN "cart_total" END'
          )
        ),
        'compliant_cart_total'
      ],
      [
        Sequelize.fn(
          'SUM',
          Sequelize.literal(
            'CASE WHEN ("compliant" = false AND ("override" IS NULL)) THEN "cart_total" END'
          )
        ),
        'noncompliant_cart_total'
      ],
      [
        Sequelize.fn(
          'COUNT',
          Sequelize.literal(
            'CASE WHEN ("compliant" = true OR NOT ("override" IS NULL)) THEN "location_state" END'
          )
        ),
        'compliant_count'
      ],
      [
        Sequelize.fn(
          'COUNT',
          Sequelize.literal(
            'CASE WHEN ("compliant" = false AND ("override" IS NULL)) THEN "location_state" END'
          )
        ),
        'noncompliant_count'
      ]
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

  const shopId = ctx.session.shop_id;

  // generate report of aggregate logs by date (for graphing)
  const report = await ComplianceLog.findAll({
    where: { shop_id: shopId },
    group: [Sequelize.literal('1')],
    attributes: [
      [
        Sequelize.fn('date_trunc', 'day', Sequelize.col('checked_at')),
        'checked_day'
      ],
      [
        Sequelize.fn(
          'SUM',
          Sequelize.literal(
            'CASE WHEN ("compliant" = true OR NOT ("override" IS NULL)) THEN "cart_total" END'
          )
        ),
        'compliant_cart_total'
      ],
      [
        Sequelize.fn(
          'SUM',
          Sequelize.literal(
            'CASE WHEN ("compliant" = false AND ("override" IS NULL)) THEN "cart_total" END'
          )
        ),
        'noncompliant_cart_total'
      ],
      [
        Sequelize.fn(
          'COUNT',
          Sequelize.literal(
            'CASE WHEN ("compliant" = true OR NOT ("override" IS NULL)) THEN date_trunc(\'day\', "checked_at") END'
          )
        ),
        'compliant_count'
      ],
      [
        Sequelize.fn(
          'COUNT',
          Sequelize.literal(
            'CASE WHEN ("compliant" = false AND ("override" IS NULL)) THEN date_trunc(\'day\', "checked_at") END'
          )
        ),
        'noncompliant_count'
      ]
    ],
    order: [[Sequelize.literal('1'), order]],
    limit: limit,
    offset: offset
  });

  return ctx.respond(200, report);
};

module.exports.logsAggregateTotal = async (ctx, next) => {
  const {
    start = moment().subtract(90, 'days').toDate(),
    end = moment().toDate()
  } = ctx.request.query;

  const shopId = ctx.session.shop_id;

  const report = await ComplianceLog.findOne({
    where: {
      shop_id: shopId,
      checked_at: {
        $between: [start, end]
      }
    },
    group: [Sequelize.col('shop_id')],
    attributes: [
      [
        Sequelize.fn(
          'SUM',
          Sequelize.literal(
            'CASE WHEN ("compliant" = true OR NOT ("override" IS NULL)) THEN "cart_total" END'
          )
        ),
        'compliant_cart_total'
      ],
      [
        Sequelize.fn(
          'SUM',
          Sequelize.literal(
            'CASE WHEN ("compliant" = false AND ("override" IS NULL)) THEN "cart_total" END'
          )
        ),
        'noncompliant_cart_total'
      ],
      [
        Sequelize.fn(
          'COUNT',
          Sequelize.literal(
            'CASE WHEN ("compliant" = true OR NOT ("override" IS NULL)) THEN "shop_id" END'
          )
        ),
        'compliant_count'
      ],
      [
        Sequelize.fn(
          'COUNT',
          Sequelize.literal(
            'CASE WHEN ("compliant" = false AND ("override" IS NULL)) THEN "shop_id" END'
          )
        ),
        'noncompliant_count'
      ]
    ]
  });

  return ctx.respond(200, report && report.dataValues);
};

module.exports.generateLogExport = async ctx => {
  // TODO: get shopId
  const shopId = 1; // ctx.session.shop_id; // FOR TEST ONLY
  const {
    start = moment().subtract(1, 'year').toDate(),
    end = moment().toDate()
  } = ctx.request.body;

  generateAndEmailLogExport(shopId, start, end);
  return ctx.respond(200, 'Export process started.');
};

async function generateAndEmailLogExport(shopId, start, end) {
  try {
    // Retrieve all logs from DB
    const logs = await ComplianceLog.findAll({
      where: {
        shop_id: shopId,
        checked_at: {
          $between: [start, end]
        }
      }
    });

    // Format to CSV
    const headers = logs ? Object.keys(logs[0].dataValues) : null;
    const logsData = logs.map(log => log.dataValues);
    const csv = json2csv({ data: logsData, fields: headers });

    // Upload to storage
    const myBucket = gcs.bucket('vinelink');
    const file = myBucket.file(
      `compliance_checks_${moment(end).format('YYYYMMDD')}_${uuid().replace(/-/g, '')}.csv`
    );
    await file.save(csv);
    const urls = await file.getSignedUrl({
      action: 'read',
      expires: moment()
        .add(process.env.LOGS_EXPORT_EXPIRY_DAYS, 'days')
        .toISOString()
    });

    // Send email
    const shop = await Shop.findById(shopId);
    email.sendEmail({
      to_email: shop.email,
      to_name: `${shop.first_name} ${shop.last_name}`,
      type: 'logs_export',
      params: {
        file_url: urls[0]
      }
    });
  } catch (e) {
    console.error(e);
  }
}
