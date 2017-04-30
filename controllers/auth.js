'use strict';

const crypto = require('crypto');
const rp = require('request-promise');

module.exports.install = async function (ctx, next) {
  const shop = ctx.req.query.shop;
  const scopes = 'read_orders,read_products,write_orders, write_products';
  const nonce = crypto.randomBytes(48).toString('hex');
  app.set('nonce', nonce);
  const install_url =
    'http://' + shop + '/admin/oauth/authorize?client_id=' + process.env.API_KEY + '&scope=' + scopes + '&redirect_uri=https://' + app_url + '/compliancy-connector/auth&state=' + nonce;
  await ctx.render('iframe', { layout: false, url: install_url });
};

module.exports.auth = async function auth (ctx, next) {
  const params = ctx.req.query;
  const hmac = params.hmac;
  const code = params.code;
  const state = params.state;
  const shop = params.shop;
  const verify = crypto.createHmac('sha256', process.env.API_SECRET);
  const data = Object.keys(params).map(function (key) {
    return key !== 'hmac' && `${key}=${params[key]}`;
  }).filter(Boolean).join('&');
  verify.update(data);
  const validHmac = verify.digest('hex') === hmac;
  const validNonce = app.get('nonce') === state;
  const re =  /(([a-z])|([0-9])|\.|-)+(.myshopify.com)/g;
  const validShop = re.test(shop);
  const reqBody = {
    client_id: process.env.API_KEY,
    client_secret: process.env.API_SECRET,
    code: code
  };

  if (validHmac && validNonce && validShop) {
    rp({
      url: `https://${shop}/admin/oauth/access_token`,
      method: 'POST',
      json: true,
      body: reqBody
    })
    .then(function (body) {
      const token = body.access_token;
      app.set('access_token', token);
      app.set('shop', shop);
    }).then(async function () {
      await ctx.res.redirect('/compliancy-connector');
    })
    .catch(function (err) {
      console.log(err);
    });
  }
};
