'use strict';

const zipToState = require('../lib/zip_to_state');
const models = require('../lib/postgres').models;
const request = require('request-promise')
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

  const compliances = await shop.getCompliance({ where: { state } });
  if (!compliances.length) {
    return ctx.respond(500, 'Compliance for this shop and state not found.');
  }

  const compliance = compliances[0];

  let taxPercent;
  let taxValue;
  if (compliance.compliant || compliance.override) {
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
    const taxPercent = tax.GetSalesTaxRatesByAddressResult.TaxRates.WineSalesTaxPercent
    const totalTax = await (taxPercent * 0.01) * (total * .01);
    console.log('total after tax', totalTax);

    const log = await ComplianceLog.create({
      shopify_shop_id: shopId,
      cart_total: total,
      compliant: compliance.compliant,
      override: compliance.override,
      tax_percent: taxPercent,
      tax_value: totalTax,
      location_state: state,
      location_zip: zip,
      checked_at: Date.now()
    });
    console.log(ctx.session.access_token);
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
             price: totalTax,
             sku: 'TAX'
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
  }




};

module.exports.getComplianceLogs = async (ctx, next) => {
  // get compliants logs
  // TODO: Pagination and sorting
  return ctx.respond(200, 'NOT IMPLEMENTED');
};

module.exports.generateLogExport = async (ctx, next) => {
  // Generate csv file export of compliance logs
  // and email download link to user
  return ctx.respond(200, 'NOT IMPLEMENTED');
};
