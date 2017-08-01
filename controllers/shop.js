'use strict';

const models = require('../lib/postgres').models;
const Shop = models.shop;
const Compliance = models.shop_compliance;
const Log = models.compliance_log;
const moment = require('moment');
const crypto = require('crypto');

// test endpoint to create shop entry in the db
// can mess with it or get rid of it
module.exports.test = async (ctx, next) => {
  // const log = await Log.create({
  //   shop_id: 1,
  //   location_state: 'MI',
  //   location_zip: '54344',
  //   currency: 'USD',
  //   cart_total: 8767.10,
  //   checked_at: moment().subtract(1, 'day'),
  //   compliant: false,
  //   override: 'manual'
  // });
  ctx.respond(200, log);
};

module.exports.getShopInfo = async (ctx, next) => {
  const shop = await Shop.findOne({
    where: { id: ctx.session.shop_id }
  });
  console.log('SHOP', shop);
  const body = {
    firstName: shop.first_name,
    lastName: shop.last_name,
    email: shop.email,
    name: shop.shopify_shop_name
  };

  ctx.respond(200, body);
};

// WEBHOOK

module.exports.updateShop = async (ctx, next) => {
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

    const update = ctx.request.body;
    const shop = await Shop.findOne({
      where: { myshopify_domain: myshopifyDomain }
    });

    if (shop) {
      const updatedShop = await Shop.update(
        {
          shopify_shop_name: update.name,
          myshopify_domain: update.myshopify_domain,
          custom_domain: update.domain
        },
        { where: { myshopify_domain: myshopifyDomain } }
      );
    }
  } catch (e) {
    console.error(`Error updating shop`);
    console.error(e.stack || e);
  }
};
