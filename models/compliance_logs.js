const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  const ComplianceLogs = sequelize.define('compliance_logs', {
    shop_id: {
      type: Sequelize.INTEGER,
    },
    cart_total: {
      type: Sequelize.FLOAT,
      allowNull: false
    },
    currency: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'USD'
    },
    compliancy: {
      type: Sequelize.STRING,
      allowNull: false
    },
    tax_percent: {
      type: Sequelize.FLOAT
    },
    tax_value: {
      type: Sequelize.FLOAT
    },
    location_state: {
      type: Sequelize.STRING,
      allowNull: false
    },
    location_zip: {
      type: Sequelize.STRING,
      allowNull: false
    },
    checked_at: {
      type: Sequelize.STRING
    },
  }, {
    freezeTableName: true,
    paranoid: true,
    underscored: true,
    indexes: [{
      fields: ['shop_id']
    }, {
      fields: ['shop_id', 'location_state']
    }]
  });
};
