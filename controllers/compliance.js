'use strict';

const zipToState = require('../lib/zip_to_state');
const Shop = require('../lib/shop');

module.exports.checkOrderCompliance = async (ctx, next) => {
  const { zip, shopId: shop_id } = ctx.request.body;
  if (!shopId || !zip) {
    return ctx.respond(400, 'Missing required body parameter(s)');
  }

  const state = await zipToState(zip);
  if (!state) {
    return ctx.respond(404, 'State could not be found from zip code');
  }

  const shop = await Shop.init(shopId);
  if (!shop) {
    return ctx.respond(404, 'Shop by that ID not found');
  }
  const isCompliant = await shop.checkAndLogCompliance(zip);

  // TODO: ZIP => TAX

  // TODO: TAX => Shopify Tax Item

  // TODO: Respond with Tax Item
};
