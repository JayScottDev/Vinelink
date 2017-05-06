'use strict';

const shipCompliant = require('../lib/ship_compliant');
const models = require('../lib/postgres').models;
const Shop = models.shop;
const ShopCompliance = models.shop_compliance;
const states = process.env.STATES_LIST.split(',');

module.exports.syncShopCompliance = async (ctx, next) => {
  const shopId = ctx.request.body.shop_id;
  const shop = await Shop.findOne({ id: shopId });

  // TODO: Authorize shop

  try {
    const scClient = await shipCompliant.createClient(shop.sc_username, shop.sc_password);
    const compByState = await scClient.getStateCompliancies();
    for (let state in compByState) {
      const comp = compByState[state];
      await ShopCompliance.upsert({
        shop_id: shopId,
        state: state,
        compliant: comp.compliant,
        override: comp.override,
        checked_at: Date.now()
      });
    }

    return ctx.respond(200, 'Sync complete');
  } catch (e) {
    console.error(e);
    return ctx.respond(500, 'Error Syncing');
  }
};

module.exports.listShopCompliance = async (ctx, next) => {
  // TODO: get shopId

  const shopId = 1; // TEST ONLY
  const compliances = await ShopCompliance.findAll({ shop_id: shopId });
  return ctx.respond(200, compliances);
};

module.exports.updateShopCompliance = async (ctx, next) => {
  // Change compliance settings (manual, auto override)
  return ctx.respond(200, 'NOT IMPLEMENTED');
};
