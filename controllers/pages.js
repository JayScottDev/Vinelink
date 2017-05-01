'use strict';

const Shopify = require('shopify-api-node')
const request = require('request-promise')
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

  const hash = await bcrypt.hash(password, saltRounds)
  const { shop } = body
  const newShop = await Shop.create({
    email,
    password,
    username,
    shopify_shop_name: shop.name,
    myshopify_domain: shop.myshopify_domain,
    custom_domain: shop.domain,
    shopify_shop_id: shop.id,
    first_name,
    last_name
  })
  console.log(body)
  ctx.render('onboard', {title: 'Welcome!'})
};

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

module.exports.reports = async (ctx, next) => {
  await ctx.render('reports', { title: 'reports' });
};

module.exports.instructions = async (ctx, next) => {
  await ctx.render('install-instructions', { title: 'install instructions' });
};

module.exports.settings = async (ctx, next) => {
  await ctx.render('settings', { title: 'settings' });
};
