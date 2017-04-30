const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('shop_compliance', {
    shop_id: {
      type: Sequelize.INTEGER,
      unique: 'shop_state'
    },
    compliant: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    },
    override: {
      type: Sequelize.ENUM('manual', 'auto')
    },
    state: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: 'shop_state'
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
      fields: ['shop_id', 'state']
    }]
  });
};
