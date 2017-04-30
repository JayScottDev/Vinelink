'use strict';

const zipToState = require('../lib/zip_to_state');
const models = require('../lib/postgres').models;
const Shop = models.shop;
const ShopCompliance = models.shop_compliance;
const ComplianceLog = models.compliance_log;

module.exports.checkOrderCompliance = async (ctx, next) => {
  const { zip, currency, shop_id: shopId, cart_total: cartTotal } = ctx.request.body;

  if (!shopId || !zip || !currency || !cartTotal) {
    return ctx.respond(400, 'Missing required body parameter(s)');
  }

  const state = await zipToState(zip);
  if (!state) {
    return ctx.respond(404, 'State could not be found from zip code');
  }

  const shop = await Shop.findOne({id: shopId});
  if (!shop) {
    return ctx.respond(404, 'Shop by that ID not found');
  }

  const compliances = await shop.getCompliance({ where: { state } });
  if (!compliances.length) {
    return ctx.respond(500, 'Compliance for this shop and state not found.');
  }

  const compliance = compliances[0];

  let taxPercent;
  let taxValue;
  if (compliance.compliant || compliance.override) {

    // TODO: IF COMPLIANT: ZIP => TAX

  }

  const log = await ComplianceLog.create({
    shop_id: shop.id,
    cart_total: cartTotal,
    currency: currency,
    compliant: compliance.compliant,
    override: compliance.override,
    tax_percent: taxPercent,
    tax_value: taxValue,
    location_state: state,
    location_zip: zip,
    checked_at: Date.now()
  });

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
