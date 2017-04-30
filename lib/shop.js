'use strict';

class Shop {
  constructor (shopId) {
    this.shopId = shopId;
  }
  async checkAndLogCompliance (zip) {

  }
};

module.exports.init = async (shopId) => {
  const shop = await ShopModel.findOne({id: shopId});
  if (!shop) return null;
  return new Shop(shopId);
};
