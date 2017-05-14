'use strict'

const crypto = require('crypto');
var bcrypt = require('bcrypt');
const rp = require('request-promise');
const models = require('../lib/postgres').models;
const Shop = models.shop;
const shipCompliant = require('../lib/ship_compliant');

module.exports.install = async function (ctx, next) {
  const shop = ctx.query.shop;
  const scopes = 'read_orders,read_products,write_orders,write_products,write_script_tags';
  ctx.session.nonce = crypto.randomBytes(48).toString('hex');
  const install_url =
    `http://${shop}/admin/oauth/authorize?client_id=${process.env.API_KEY}&scope=${scopes}&redirect_uri=https://${process.env.APP_URL}/compliancy-connector/auth&state=${ctx.session.nonce}`;
  await ctx.render('iframe', { layout: false, url: install_url })
}

module.exports.auth = async function auth (ctx, next) {
  const { hmac, code, state, shop } = ctx.query;
  const verify = crypto.createHmac('sha256', process.env.API_SECRET.toString());
  const data = Object.keys(ctx.query).map(function (key) {
    return key !== 'hmac' && `${key}=${ctx.query[key]}`
  }).filter(Boolean).join('&');
  verify.update(data);
  const validHmac = verify.digest('hex') === hmac;
  const validNonce = ctx.session.nonce === state;
  const re =  /(([a-z])|([0-9])|\.|-)+(.myshopify.com)/g;
  const validShop = re.test(shop);
  const reqBody = {
    client_id: process.env.API_KEY,
    client_secret: process.env.API_SECRET,
    code: code
  };

  if (validHmac && validNonce && validShop) {
    const body = await rp({
      url: `https://${shop}/admin/oauth/access_token`,
      method: 'POST',
      json: true,
      body: reqBody
    })
    ctx.session.access_token = body.access_token;
    ctx.session.shop = shop;
    ctx.redirect('/compliancy-connector');
  }
}

module.exports.login = async function (ctx, next) {
  const { username, password } = ctx.request.body;
  const shop = await Shop.findOne({username});
  if (!shop) {
    return ctx.respond(404, 'Incorrect username or password');
  }
  const appPasswordHash = await bcrypt.hash(password, 10)
  console.log(shop.dataValues.password);
  //Check if password matches one stored in db
  const validPassword = await bcrypt.compare(password, shop.dataValues.password)
  if (!validPassword) {
    return ctx.respond(404, 'Incorrect username or password');
  }

  // if valid username and password, store the shop id in a session and redirec to the dashboard
  ctx.session.store_id = shop.dataValues.shopify_shop_id
  ctx.redirect('/compliancy-connector/dashboard');
}

module.exports.signup = async function (ctx, next) {
  const { first_name, last_name, email, username, password, sc_username, sc_password } = ctx.request.body;

  const scClient = await shipCompliant.createClient(sc_username, sc_password);
  if (!scClient) {
    return ctx.respond(500, 'Could not connect to ship compliant');
  }

  const validCredentials = await scClient.test()

  if (!validCredentials) {
    return ctx.respond(404, 'We could not reach ship compliante with credentials provided');
  }
  
  const body = await request({
    uri: `https://${ctx.session.shop}/admin/shop.json`,
    headers: {
      'X-Shopify-Access-Token': ctx.session.access_token,
    }
  })
  const { shop } = JSON.parse(body)
  ctx.session.store_id = shop.id
  const appPasswordHash = await bcrypt.hash(password, 10)
  const scPasswordHash = await bcrypt.hash(sc_password, 10)
  const newShop = await Shop.create({
    email,
    password: appPasswordHash,
    username,
    shopify_shop_name: shop.name,
    myshopify_domain: shop.myshopify_domain,
    custom_domain: shop.domain,
    shopify_shop_id: shop.id,
    first_name,
    last_name,
    sc_username,
    sc_password: scPasswordHash,
    shop_access_token: ctx.session.access_token,
  })
  ctx.redirect('/compliancy-connector/dashboard');


}
