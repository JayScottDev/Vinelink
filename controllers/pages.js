'use strict';

const Shopify = require('shopify-api-node');
const request = require('request-promise');
const path = require('path');
const models = require('../lib/postgres').models;
const Shop = models.shop;
const shipCompliant = require('../lib/ship_compliant');

module.exports.setup = async (ctx, next) => {
  const { first_name, last_name, email, username, password } = ctx.request.body;

  const body = await request({
    uri: `https://${ctx.session.shop}/admin/shop.json`,
    headers: {
      'X-Shopify-Access-Token': ctx.session.access_token
    }
  });

  const hash = await bcrypt.hash(password, 10);
  const { shop } = JSON.parse(body);
  ctx.session.store_id = shop.id;
  const newShop = await Shop.create({
    email,
    password: hash,
    username,
    shopify_shop_name: shop.name,
    myshopify_domain: shop.myshopify_domain,
    custom_domain: shop.domain,
    shopify_shop_id: shop.id,
    first_name,
    last_name
  });
  ctx.redirect('/compliancy-connector/add-ship-compliant');
};

module.exports.addsc = async (ctx, next) => {
  await ctx.render('add-ship-compliant');
};

module.exports.addscp = async (ctx, next) => {
  const { sc_username, sc_password } = ctx.request.body;
  const hash = await bcrypt.hash(sc_password, 10);
  const update = await Shop.update(
    {
      sc_username,
      sc_password: hash
    },
    {
      where: { shopify_shop_id: ctx.session.store_id.toString() },
      returning: true
    }
  );
  await ctx.redirect('/compliancy-connector/home');
};

module.exports.main = async (ctx, next) => {
  await ctx.render('landing', {
    apiKey: process.env.API_KEY,
    shop: ctx.session.shop
  });
};

module.exports.login = async (ctx, next) => {
  await ctx.render('login');
};

module.exports.signup = async (ctx, next) => {
  await ctx.render('signup');
};

module.exports.reports = async (ctx, next) => {
  await ctx.render('reports', { title: 'reports' });
};

module.exports.instructions = async (ctx, next) => {
  await ctx.render('install-instructions', { title: 'install instructions' });
};

module.exports.settings = async (ctx, next) => {
  await ctx.render('settings', { title: 'greetings' });
};

module.exports.inventory = async (ctx, next) => {
  const shopId = ctx.session.shop_id;

  const shop = await Shop.findOne({ where: { id: shopId } });
  if (!shop) {
    return ctx.respond(404, 'Incorrect username or password');
  }

  const scClient = await shipCompliant.createClient(
    shop.sc_username,
    shop.sc_password
  );

  const inventory = await scClient.getInventory();

  await ctx.respond(200, inventory);
};

module.exports.products = async (ctx, next) => {
  const shopId = ctx.session.shop_id;
  const shop = await Shop.findOne({ where: { id: shopId } });
  if (!shop) {
    return ctx.respond(404, 'Incorrect username or password');
  }
  const accessToken = shop.shopify_access_token;
  const products = await request({
    method: 'GET',
    url: `https://${shop.myshopify_domain}/admin/products.json`,
    headers: {
      'X-Shopify-Access-Token': accessToken
    }
  });

  const parsedProducts = JSON.parse(products);

  const skus = await parsedProducts.products.map(product => {
    return {
      brand_key: product.vendor,
      id: product.variants[0].id,
      product_key: product.variants[0].sku
    };
  });
  console.log(products);

  await ctx.respond(200, products);
};

module.exports.addProduct = async (ctx, next) => {};
