const request = require('request-promise');
const models = require('./postgres').models;
const Shop = models.shop;
const webhooks = require('../config/shopify_webhooks').webhooks;

const apiPrefix = `https://${process.env.APP_URL}`;

// Register webhooks
module.exports.registerWebhooks = async () => {
  const shops = await Shop.findAll();
  for (let shop of shops) {
    try {
      const { webhooks: existing } = await shopifyRequest(shop, 'GET', 'admin/webhooks');
      for (let webhook of webhooks) {
        const address = `${apiPrefix}/${webhook.path}`;
        if (!existing.some( ex => (ex.topic === webhook.topic) && (ex.address === address) )) {
          const resp = await shopifyRequest(shop, 'POST', 'admin/webhooks', {
            webhook: {
              address,
              topic: webhook.topic,
              format: 'json'
            }
          });
        }
      }
      console.log('Shopify Webhooks synced');
    } catch (e) {
      console.error(`Unable to sync webhooks for ${shop.shopify_shop_name}`);
      console.error(Object.keys(e));
      console.error(e.response.body);
    }
  }
};

async function shopifyRequest (shop, method, path, body) {
  return await request({
    method,
    uri: `https://${shop.myshopify_domain}/${path}.json`,
    headers: {
      'X-Shopify-Access-Token': shop.shopify_access_token
    },
    json: true,
    body
  });
}
