'use strict';

const models = require('../lib/postgres').models;
const Shop = models.shop;
const Compliance = models.shop_compliance;

// test endpoint to create shop entry in the db
// can mess with it or get rid of it
module.exports.test = async (ctx, next) => {
  const shop = await Shop.create({
    email: 'soimeemail@gmail.com',
    password: 'fsadfasdfads',
    username: 'fasfasfddas',
    shopify_shop_name: 'fasdf',
    shopify_shop_id: 'fasdfsa',
    myshopify_domain: 'fadsfs',
    sc_username: process.env.SC_USER,
    sc_password: process.env.SC_PASSWORD
  });
  const comp = await Compliance.create({
    shop_id: shop.id,
    compliant: true,
    override: null,
    state: 'CA'
  });
  ctx.respond(200, [shop, comp]);
};
