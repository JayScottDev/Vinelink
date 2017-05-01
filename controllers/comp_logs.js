'use strict';

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
  const createProduct = await rp({
    method: 'POST',
    url: 'https://ship-compliant-dev.myshopify.com/admin/products.json',
    headers: {
      'X-Shopify-Access-Token': access,
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
  console.log(tax)

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

  // TODO: TAX => Shopify Tax Item

  // TODO: Respond with Tax Item
  return ctx.respond(200, 'NOT IMPLEMENTED');
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
