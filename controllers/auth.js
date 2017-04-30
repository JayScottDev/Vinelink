'use strict'

const crypto = require('crypto')
const rp = require('request-promise')

module.exports.install = async function (ctx, next) {
  const shop = ctx.query.shop
  const scopes = 'read_orders,read_products,write_orders,write_products,write_script_tags'
  ctx.session.nonce = crypto.randomBytes(48).toString('hex')
  const install_url =
    `http://${shop}/admin/oauth/authorize?client_id=${process.env.API_KEY}&scope=${scopes}&redirect_uri=https://${process.env.APP_URL}/compliancy-connector/auth&state=${ctx.session.nonce}`
  await ctx.render('iframe', { layout: false, url: install_url })
}

module.exports.auth = async function auth (ctx, next) {
  const { hmac, code, state, shop } = ctx.query
  const verify = crypto.createHmac('sha256', process.env.API_SECRET.toString())
  const data = Object.keys(ctx.query).map(function (key) {
    return key !== 'hmac' && `${key}=${ctx.query[key]}`
  }).filter(Boolean).join('&')
  verify.update(data)
  const validHmac = verify.digest('hex') === hmac
  const validNonce = ctx.session.nonce === state
  const re =  /(([a-z])|([0-9])|\.|-)+(.myshopify.com)/g
  const validShop = re.test(shop)
  const reqBody = {
    client_id: process.env.API_KEY,
    client_secret: process.env.API_SECRET,
    code: code
  }

  if (validHmac && validNonce && validShop) {
    const body = await rp({
      url: `https://${shop}/admin/oauth/access_token`,
      method: 'POST',
      json: true,
      body: reqBody
    })
    ctx.session.access_token = body.access_token
    ctx.session.shop = shop
    ctx.redirect('/compliancy-connector')
  }
}
