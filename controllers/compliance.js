'use strict';

const shipCompliant = require('../lib/ship_compliant');
const models = require('../lib/postgres').models;
const Shop = models.shop;
const ShopCompliance = models.shop_compliance;
const states = process.env.STATES_LIST.split(',');

module.exports.syncShopCompliance = async (ctx = {}, next = {}, ...args) => {

  const shopId = args[0].toString();

  const shop = await Shop.findOne({ where: { id: shopId }});

  try {
    const scClient = await shipCompliant.createClient(shop.sc_username, shop.sc_password);
    if (!scClient) {
      throw 'Cannot connect to ShipCompliant';
    }
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

  const { sort = 'state', order = 'ASC', limit = 100, offset = 0 } = ctx.request.query;
  if (!['ASC', 'DESC'].includes(order)) {
    return ctx.respond(400, 'Query parameter order must be "ASC" or "DESC"');
  }

  const shopId = ctx.session.shop_id;
  const compliances = await ShopCompliance.findAll({
    where: { shop_id: shopId },
    order: [[sort, order], ['state', 'ASC']],
    limit: limit,
    offset: offset
  });
  return ctx.respond(200, compliances);
};

module.exports.updateShopCompliance = async (ctx, next) => {

  const shopId = ctx.session.shop_id;
  const { state, override } = ctx.request.body;

  // Input validation
  if (!['auto', 'manual', null].includes(override)) {
    return ctx.respond(400, 'Invalid override value.');
  }

  const comp = await ShopCompliance.findOne({ where: { state, shop_id: shopId }});
  comp.override = override;
  await comp.save();

  return ctx.respond(200, comp);
};
