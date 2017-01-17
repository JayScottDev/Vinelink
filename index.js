const express = require('express');
const app = express();
const crypto = require('crypto');
const rp = require('request-promise');
const Shopify = require('shopify-api-node');
const soap = require('soap');
const parseString = require('xml2js').parseString;
const js2xmlparser = require("js2xmlparser");
const config = require('./.config')
const app_url = 'cbd13b69.ngrok.io'
const exphbs  = require('express-handlebars');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));


app.set('views', './views')
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

const shopify = new Shopify({
  shopName: 'UWA-dev',
  accessToken: '8731e2360115e81684a7aafab1d33013-1483837839'
})

console.log(config.API_KEY);

var url = 'https://ws-dev.shipcompliant.com/services/1.2/coreservice.asmx?WSDL'

soap.createClient(url, function (err, client) {

})

app.get('/compliancy-connector/', function(req, res) {
  res.send('hello');
})

app.get('/compliancy-connector/install', function (req, res) {
  const shop = req.query.shop;
  const scopes = "read_orders,read_products,write_orders"
  const nonce = crypto.randomBytes(48).toString('hex')
  app.set('nonce', nonce);
  // const install_url =
  //   `http://${shop}/admin/oauth/authorize?client_id=${config.API_KEY}&scope=${scopes}&redirect_uri=https://${app_url}/compliancy-connector/auth&state=${nonce}`
    res.render('home', {shop: shop, apiKey: config.API_KEY, scope: scopes, appUrl: app_url, nonce:nonce})
})

app.get('/compliancy-connector/auth', function (req, res) {
  const params = req.query
  const hmac = params.hmac
  const code = params.code
  const state = params.state
  const shop = params.shop
  const verify = crypto.createHmac('sha256', config.API_SECRET);
  const data = Object.keys(params).map(function (key) {
    return key !== 'hmac' && `${key}=${params[key]}`
  }).filter(Boolean).join('&')
  verify.update(data)
  const validHmac = verify.digest('hex') === hmac
  const validNonce = app.get('nonce') === state
  const re =  /(([a-z])|([0-9])|\.|-)+(.myshopify.com)/g
  const validShop = re.test(shop)
  const reqBody = {
    'client_id': config.API_KEY,
    'client_secret': config.API_SECRET,
    'code': code
  }

  if (validHmac && validNonce && validShop) {
    rp({
      url: `https://${shop}/admin/oauth/access_token`,
      method: 'POST',
      json: true,
      body: reqBody
    })
    .then(function (body) {
      console.log('access', body.access_token);
      app.set('access_token', body.access_token);
    })
    .catch(function(err) {
      throw err
    })
  }

  res.redirect(`http://${shop}/admin/apps/compliancy-connector`)

  res.end()
})


app.listen(3030, function () {
  console.log('Listening on port 3030...');
})