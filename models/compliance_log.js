const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  const ComplianceLog = sequelize.define('compliance_log', {
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
    compliant: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    },
    override: {
      type: Sequelize.ENUM('manual', 'auto')
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
      type: Sequelize.DATE
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
  return ComplianceLog;
};
