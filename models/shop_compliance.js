const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('shop_compliance', {
    shop_id: {
      type: Sequelize.INTEGER,
    },
    compliancy: {
      type: Sequelize.STRING,
      allowNull: false
    },
    state: {
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
      fields: ['shop_id', 'state']
    }]
  });
};
