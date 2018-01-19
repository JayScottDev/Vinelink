const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  const Order = sequelize.define('order', {
    shop_id: {
      type: Sequelize.INTEGER,
      unique: 'order',
    },
    cart_total: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    currency: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'USD'
    },
    order_key: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: 'order',
    },
    shopify_order_no: {
      type: Sequelize.STRING,
    },
    tracking_numbers: {
      type: Sequelize.ARRAY(Sequelize.STRING),
      defaultValue: []
    },
    shipping_service: {
      type: Sequelize.STRING,
    },
    shopify_fulfillment_id: {
      type: Sequelize.STRING,
    },
    success: {
      type: Sequelize.BOOLEAN,
    },
    status: {
      type: Sequelize.ENUM('InProcess', 'PaymentAccepted', 'SentToFulfillment', 'Shipped', 'Delivered', 'Voided'),
    },
    compliant: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    override: {
      type: Sequelize.ENUM('manual', 'auto'),
    },
    quarantined: {
      type: Sequelize.BOOLEAN,
    },
    tax_value: {
      type: Sequelize.FLOAT
    },
    location_state: {
      type: Sequelize.STRING,
    },
    location_zip: {
      type: Sequelize.STRING,
    },
    cancelled: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    cancelled_at: {
      type: Sequelize.DATE
    },
    ordered_at: {
      type: Sequelize.DATE
    },
    last_synced_at: {
      type: Sequelize.DATE
    },
  }, {
    freezeTableName: true,
    paranoid: true,
    underscored: true,
    indexes: [{
      fields: ['shop_id']
    }, {
      fields: ['shop_id', 'order_key']
    }]
  });
};
