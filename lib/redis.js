'use strict';

const redis = require('redis');
const client = redis.createClient({
  host: process.env.RES_REDIS_HOST,
  port: process.env.RES_REDIS_PORT,
});

module.exports = async (ctx, next) => {
  ctx.resource.redis = client;
  await next();
};
