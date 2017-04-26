'use strict';

const utils = require('../utils');
const constants = require('../constants');

module.exports.sendToSC = async function sendToSC (ctx, next) {
  const result = req.body;
  const shop = ctx.req.headers['x-shopify-shop-domain'];
  const queryConfig = {
    text: 'SELECT username, password FROM client_info WHERE store_name = $1',
    values: [shop]
  };
  client.query(queryConfig, function (err, result) {
    if (err) {
      throw err;
    }

    const username = result.username;
    const password = result.password;

    const req = {
      Request: {
        Security: {
          PartnerKey: '', //leave blank for development
          Password: 'Password1',
          Username: 'metonymyws@shipcompliant.com',
        },
        AddressOption: {
          RejectIfAddessSuggested: false,
          IgnoreStreetLevelErrors: true,
        },
        PersistOption: null,
        CommitOption: 'AllShipments',
        SalesOrder: {
          BillTo: {
            City: result.billing_address.city,
            Company: result.billing_address.company,
            Country: result.billing_address.country_code,
            DateOfBirth: utils.generateDOB(),
            Email: '',
            FirstName: result.billing_address.first_name,
            LastName: result.billing_address.last_name,
            Phone: result.billing_address.phone,
            State: result.billing_address.province_code,
            Street1: result.billing_address.address1,
            Street2: result.billing_address.address2,
            Zip1: result.billing_address.zip,
          },
          CustomerKey: result.customer.id,
          FulfillmentType: 'club', //club or daily
          OrderType: 'Internet',
          PurchaseDate: result.created_at, //Unix time stamp
          SalesOrderKey: result.order_number,
          Shipments: {
            Shipment: {
              LicenseRelationship: 'SupplierToConsumer',
              ShipDate: Date.now(), //Unix Timestamp, this field is required, but unknown, setting to current date for dev only
              shipmentItems: items,
              ShipmentKey: result.shipping_lines.id,
              ShipmentStatus: 'PaymentAccepted',
              ShippingService: result.shipping_lines.title, //need to get shipping service codes
              ShipTo: {
                City: result.billing_address.city,
                FirstName: result.billing_address.first_name,
                LastName: result.billing_address.last_name,
                Phone: result.billing_address.phone,
                State: result.billing_address.province_code,
                Street1: result.billing_address.address1,
                Street2: result.billing_address.address2,
                Zip1: result.billing_address.zip,
              }
            }
          }
        }
      }
    };

    //PersistSalesOrder forces the order sans compliance, will be switching to CommitSalesOrder

    soap.createClient(scUrl, function (err, client) {
      client
       .CoreService
       .CoreServiceSoap12
       .PersistSalesOrder(constants.req, async function (err, result) {
         if (err) {
           throw err;
         }
         console.log(result.PersistSalesOrderResult.ResponseStatus);
         await ctx.res.sendStatus(200).end();
       });
    });
  });
};
