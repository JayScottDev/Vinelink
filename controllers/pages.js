'use strict';

const Shopify = require('shopify-api-node')
const request = require('request-promise')
const send = require('koa-send');
const path = require('path')
var bcrypt = require('bcrypt');
const models = require('../lib/postgres').models;
const Shop = models.shop


module.exports.setup = async (ctx, next) => {
  const { first_name, last_name, email, username, password } = ctx.request.body

  const body = await request({
    uri: `https://${ctx.session.shop}/admin/shop.json`,
    headers: {
      'X-Shopify-Access-Token': ctx.session.access_token
    }
  })

  const hash = await bcrypt.hash(password, 10)
  const { shop } = JSON.parse(body)
  ctx.session.store_id = shop.id
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
  })
  ctx.redirect('/compliancy-connector/add-ship-compliant')
};

module.exports.addsc = async (ctx, next) => {
  await ctx.render('add-ship-compliant')
}

module.exports.addscp = async (ctx, next) => {
  const { sc_username, sc_password } = ctx.request.body
  const hash = await bcrypt.hash(sc_password, 10)
  const update = await Shop.update({
    sc_username,
    sc_password: hash
  }, {
    where: { shopify_shop_id: ctx.session.store_id.toString() },
    returning: true
  })
  await ctx.redirect('/compliancy-connector/home')
}

module.exports.main = async (ctx, next) => {
  const shop = ctx.session.shop.split('.')[0];
  const access = ctx.session.access_token
  console.log(shop, access);
  const shopify = new Shopify({
    shopName: shop,
    accessToken: access
  });

  await ctx.render('onboard', {apiKey: process.env.API_KEY, shop: ctx.session.shop });
};

module.exports.home = async (ctx, next) => {
  ctx.session.access_token = ''
  await send(ctx, path.resolve(__dirname, '../dist/index.html'))
}

module.exports.reports = async (ctx, next) => {
  await ctx.render('reports', { title: 'reports' });
};

module.exports.instructions = async (ctx, next) => {
  await ctx.render('install-instructions', { title: 'install instructions' });
};

module.exports.settings = async (ctx, next) => {
  await ctx.render('settings', { title: 'greetings' });
};
