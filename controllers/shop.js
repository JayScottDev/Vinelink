'use strict';

const models = require('../lib/postgres').models;
const Shop = models.shop;
const Compliance = models.shop_compliance;
const Log = models.compliance_log;
const moment = require('moment');

// test endpoint to create shop entry in the db
// can mess with it or get rid of it
module.exports.test = async (ctx, next) => {
  // const log = await Log.create({
  //   shop_id: 1,
  //   location_state: 'MI',
  //   location_zip: '54344',
  //   currency: 'USD',
  //   cart_total: 8767.10,
  //   checked_at: moment().subtract(1, 'day'),
  //   compliant: false,
  //   override: 'manual'
  // });
  ctx.respond(200, log);
};
