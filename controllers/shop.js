'use strict';

const models = require('../lib/postgres').models;
const Shop = models.shop;
const Compliance = models.shop_compliance;

module.exports.addSCCredentials = async (ctx, next) => {
  const username = ctx.req.body.username;
  const password = ctx.req.body.password;

  //add user ship compliant creditials to db, still needs encryption

  const queryConfig = {
    text: 'INSERT INTO client_info (store_name, username, password) VALUES ($1, $2, $3',
    values: [app.get('shop'), username, password],
  };

  client.query(queryConfig, async function (err, result) {
    if (err) {
      throw err;
      ctx.respond(500);
    }
    console.log(result);
    await ctx.res.redirect('/compliancy-connector');
  });
};

// test endpoint to create shop entry in the db
// can mess with it or get rid of it
module.exports.test = async (ctx, next) => {
  const shop = await Shop.create({
    email: 'soimeemail@gmail.com',
    password: 'fsadfasdfads',
    username: 'fasfasfddas',
    shopify_shop_name: 'fasdf',
    shopify_shop_id: 'fasdfsa',
    myshopify_domain: 'fadsfs'
  });
  const comp = await Compliance.create({
    shop_id: shop.id,
    compliant: true,
    override: null,
    state: 'CA'
  });
  ctx.respond(200, [shop, comp]);
};
