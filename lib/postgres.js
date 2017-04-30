'use strict';

const Sequelize = require('sequelize');
const fs = require('fs');

const sequelize = new Sequelize(process.env.RES_POSTGRES_DATABASE, process.env.RES_POSTGRES_USER, process.env.RES_POSTGRES_PASSWORD, {
  host: process.env.RES_POSTGRES_HOST,
  port: process.env.RES_POSTGRES_PORT,
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
});

for (let model of fs.readdirSync('./models')) {
  require(`../models/${model}`)(sequelize);
}

// Define relations
const {
  shop: Shop,
  compliance_logs: ComplianceLogs,
  shop_compliance: ShopCompliance
} = sequelize.models;

Shop.hasMany(ComplianceLogs);
Shop.hasMany(ShopCompliance);

sequelize.sync({force: true});

module.exports.client = sequelize;

module.exports.models = sequelize.models;

module.exports.middleware = async (ctx, next) => {
  ctx.db = ctx.db || {};
  ctx.db.sql = sequelize;
  await next();
};

