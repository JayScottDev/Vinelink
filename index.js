const express = require('express');
const app = express();
const exphbs  = require('express-handlebars');
const morgan = require('morgan')
const path = require('path');
const bodyParser = require('body-parser')
const crypto = require('crypto');
const rp = require('request-promise');
const pg = require('pg')
const Shopify = require('shopify-api-node');
const soap = require('soap');
const parseString = require('xml2js').parseString;
const js2xmlparser = require("js2xmlparser");
const config = require('./.config')

// TODO: move to config file
const app_url = 'cbd13b69.ngrok.io'
const scUrl = 'https://ws-dev.shipcompliant.com/services/1.2/coreservice.asmx?WSDL'

const dbConfig = {
  user: 'admin',
  database: 'compliancy-connector',
  password: 'm3t0nymy!',
  host: 'localhost',
  port: 5432,
  max: 10,
  idleTimeoutMillis: 30000,
}

const client = new pg.Client(dbConfig);

client.connect(function(err) {
  if (err) {
    throw err
  }
  console.log('we connected');
})

//VIEW
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('views', './views')
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//MIDDLEWARE
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')));

app.get('/compliancy-connector', function(req, res) {
  const shop = app.get('shop').split('.')[0]
  const access = app.get('access_token')
  console.log(shop, access);
  const shopify = new Shopify({
    shopName: shop,
    accessToken: access
  })

  rp({
    url: 'https://uwa-dev.myshopify.com/admin/webhooks/452591629.json',
    method: 'GET',
    headers: {
      'X-Shopify-Access-Token': access,
    },
    json: true,
  })


  rp({
    url: 'https://uwa-dev.myshopify.com/admin/webhooks.json',
    method: 'GET',
    headers: {
      'X-Shopify-Access-Token': access,
    },
    json: true,
    // body: {
    //   "webhook": {
    //     "topic": "orders/paid",
    //     "address": `https://${app_url}/compliancy-connector/checkouts`,
    //     "format": "json"
    //   }
    // }
  }).then(function(response) {
    console.log('webhooks', response);
    const webhooks = response.webhooks
    const orders = false

    webhooks.forEach(function (webhook) {
      console.log(webhook.topic);
      if (webhook.topic === "orders/create") {
        orders = true
      }
    })

    if (!orders) {
      rp({
        url: 'https://uwa-dev.myshopify.com/admin/webhooks.json',
        method: 'GET',
        headers: {
          'X-Shopify-Access-Token': access,
        },
        json: true,
        body: {
          "webhook": {
            "topic": "orders/create",
            "address": `https://${app_url}/compliancy-connector/checkouts`,
            "format": "json"
          }
        }
      })
      .then(function (response) {
        console.log('orders webhook created.', response);
      })
      .catch(function (err) {
        throw err;
      })
    }
  })
  .catch(function (err) {
    if (err) {
      console.log(err);
    }
  })
  //
  // shopify.webhook.create({
  //   "topic": "checkouts\/create",
  //   "address": `https:\/\/${app_url}\/compliancy-connector\/checkouts`,
  //   "format": "json"
  // })
  // .then(function(body) {
  //   console.log('BODY', body);
  // })
  // .catch(function (err) {
  //   console.log(err);
  // })

  res.render('home', {apiKey: config.API_KEY, shop: app.get('shop') })
})

app.get('/compliancy-connector/install', function (req, res) {
  const shop = req.query.shop;
  const scopes = "read_orders,read_products,write_orders"
  const nonce = crypto.randomBytes(48).toString('hex')
  app.set('nonce', nonce);
  const install_url =
    'http://' + shop + '/admin/oauth/authorize?client_id=' + config.API_KEY + '&scope=' + scopes + '&redirect_uri=https://' + app_url + '/compliancy-connector/auth&state=' + nonce
    res.render('iframe', { layout: false, url: install_url })
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
      const token = body.access_token
      app.set('access_token', token);
      app.set('shop', shop)
    }).then(function() {
      res.redirect('/compliancy-connector')
    })
    .catch(function (err) {
      console.log(err);
    })
  }

})

app.post('/add-credentials', function(req, res) {
  const username = req.body.username
  const password = req.body.password
  const partnerKey = req.body.partnerKey


  const queryConfig = {
    text: 'INSERT INTO client_info (store_name, username, password, partner_key) VALUES ($1, $2, $3, $4)',
    values: [app.get('shop'), username, password, partnerKey],
  };

  client.query(queryConfig, function(err, result) {
    if (err) {
      throw err
      res.status(500).end()
    }
    console.log(result);
    res.redirect('/compliancy-connector')
  })
})

app.post('/compliancy-connector/checkouts', function (req, res) {
  console.log('we got an order');
  console.log(req.body);
  res.sendStatus(200).end();
})

app.listen(3030, function () {
  console.log('Listening on port 3030...');
})
