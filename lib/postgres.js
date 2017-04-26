'use strict';

const pg = require('pg');

// TODO: Use Sequelize?
// TODO: Connection pooling

const dbConfig = {
  user: process.env.RES_POSTGRES_USER,
  database: process.env.RES_POSTGRES_DATABASE,
  password: process.env.RES_POSTGRES_PASSWORD,
  host: process.env.RES_POSTGRES_HOST,
  port: process.env.RES_POSTGRES_PORT,
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

module.exports = async (ctx, next) => {
  ctx.resource.postgres = client;
  await next();
};
