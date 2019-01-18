'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.createTable(
      'shop',
      {
        email: {
          type: Sequelize.STRING,
          validate: { isEmail: true },
          allowNull: false,
        },
        password: {
          type: Sequelize.STRING,
          allowNull: false
        },
        username: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true
        },
        shopify_shop_name: {
          type: Sequelize.STRING,
          unique: true
        },
        myshopify_domain: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true
        },
        custom_domain: {
          type: Sequelize.STRING
        },
        shopify_shop_id: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true
        },
        first_name: {
          type: Sequelize.STRING
        },
        last_name: {
          type: Sequelize.STRING
        },
        account_disabled: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        },
        last_login: {
          type: Sequelize.DATE
        },
        sc_username: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        sc_password: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        shopify_access_token: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        }
      }, {
        freezeTableName: true,
        paranoid: true,
        underscored: true,
        indexes: [{
          fields: ['username']
        }, {
          fields: ['email']
        }]
      },
      {
        engine: 'MYISAM',                     // default: 'InnoDB'
        charset: 'latin1',                    // default: null
        schema: 'public'                      // default: public, PostgreSQL only.
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.dropTable('shop')
  }
};
