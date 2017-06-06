'use strict';

const Sequelize = require('sequelize');
const fs = require('fs');

const sequelize = new Sequelize(
  process.env.RES_POSTGRES_DATABASE,
  process.env.RES_POSTGRES_USER,
  process.env.RES_POSTGRES_PASSWORD,
  {
    host: process.env.RES_POSTGRES_HOST,
    port: process.env.RES_POSTGRES_PORT,
    dialect: 'postgres',
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    }
  }
);

for (let model of fs.readdirSync('./models')) {
  require(`../models/${model}`)(sequelize);
}

// Define relations
const {
  shop: Shop,
  compliance_log: ComplianceLog,
  shop_compliance: ShopCompliance,
  order: Order
} = sequelize.models;

Shop.hasMany(ComplianceLog, { as: 'Log' });
Shop.hasMany(Order, { as: 'Order' });
Shop.hasMany(ShopCompliance, { as: 'Compliance' });

sequelize.sync(); // { force: true } ONLY USE IN DEV

module.exports.client = sequelize;

module.exports.models = sequelize.models;

module.exports.middleware = async (ctx, next) => {
  ctx.db = ctx.db || {};
  ctx.db.sql = sequelize;
  await next();
};
