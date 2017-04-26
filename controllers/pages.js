'use strict';

module.exports.main = async (ctx, next) => {
  const shop = app.get('shop').split('.')[0];
  const access = app.get('access_token');
  console.log(shop, access);
  const shopify = new Shopify({
    shopName: shop,
    accessToken: access
  });

  await ctx.render('home', {apiKey: config.API_KEY, shop: app.get('shop') });
};

module.exports.reports = async (ctx, next) => {
  await ctx.render('reports', { title: 'reports' });
};

module.exports.instructions = async (ctx, next) => {
  await ctx.render('install-instructions', { title: 'install instructions' });
};

module.exports.settings = async (ctx, next) => {
  await ctx.render('settings', { title: 'settings' });
};
