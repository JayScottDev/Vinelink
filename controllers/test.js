'use strict';
const z2s = require('../lib/zip_to_state');

module.exports.test = async (ctx, next) => {
  const zip = ctx.params.zip;
  const state = await z2s(zip);
  console.log(state);
  ctx.body = state;
};
