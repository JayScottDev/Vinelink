'use strict';

const redis = require('redis');
const client = redis.createClient({
  host: process.env.RES_REDIS_HOST,
  port: process.env.RES_REDIS_PORT,
});

// promisify methods
client.getAsync = (...args) => {
  return new Promise((resolve, reject) => {
    client.get(...args, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

client.setAsync = (...args) => {
  return new Promise((resolve, reject) => {
    client.set(...args, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

module.exports.client = client;

module.exports.middleware = async (ctx, next) => {
  ctx.db = ctx.db || {};
  ctx.db.redis = client;
  await next();
};
