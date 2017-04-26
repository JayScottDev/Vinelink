'use strict';

const Koa = require('koa');
const app = new Koa();
const hbs = require('koa-hbs');
const serve = require('koa-static');

const bodyparser = require('koa-bodyparser');
const pg = require('pg');
const Shopify = require('shopify-api-node');
const soap = require('soap');
const parseString = require('xml2js').parseString;
const js2xmlparser = require('js2xmlparser');
const constants = require('./constants');
const utils = require('./utils');
const shipcompliant = require('./shipcompliantmethods');
const router = require('./router');

// TODO: move to config file
//change app url to whatever ngrok gives you, also need to change the url in shopify app settings
const app_url = 'e8962486.ngrok.io';
const scUrl = 'https://ws-dev.shipcompliant.com/services/1.2/coreservice.asmx?WSDL';
const user = 'metonymyws@shipcompliant.com';
const pass = 'Password1';
const auth = {
  PartnerKey: '',
  Password: pass,
  Username: user,
};


// TODO: modularize db init

const dbConfig = {
  user: 'admin',
  database: 'compliancy-connector',
  password: 'm3t0nymy!',
  host: 'localhost',
  port: 5432,
  max: 10,
  idleTimeoutMillis: 30000,
};

const client = new pg.Client(dbConfig);

client.connect(function (err) {
  if (err) {
    throw err;
  }
  console.log('we connected');
});


//VIEW
app.use(hbs.middleware({
  viewPath: `${__dirname}/views`,
  partialsPath: `${__dirname}/views/partials`,
  layoutsPath: `${__dirname}/views/layouts`,
  defaultLayout: `main`,
  extname: `.handlebars`
}));

//MIDDLEWARE
app.use(bodyparser());
app.use(serve('public'));

app.use(router.routes);
app.use(router.allowedMethods);

app.listen(process.env.PORT || 3030, function () {
  console.log('Listening on port 3030...');
});
