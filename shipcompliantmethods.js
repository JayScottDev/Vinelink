const constants = require('./constants')
const soap = require('soap');

module.exports = {
  isShippingAvailable: function (data) {
    return new Promise(function (resolve, reject) {
      soap.createClient(constants.urls.supplierService, function (err, client) {
        client
         .SupplierService
         .SupplierServiceSoap12
         .IsShippingAvailable(data, function (err, result) {
           if (err) return reject(err);
           resolve(result);
         });
      });
    });
  },

  getSalesTax: function (data) {
    return new Promise(function (resolve, reject) {
      soap.createClient(constants.urls.taxService, function (err, client) {
        client
          .TaxService
          .TaxServiceSoap12
          .GetSalesTaxRatesByAddress(data, function (err, result) {
            if (err) reject(err);
            resolve(result);
          });
      });
    });
  }
};
