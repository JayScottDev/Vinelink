const express = require('express');
const app = express();
const soap = require('soap');
const parseString = require('xml2js').parseString;
const js2xmlparser = require('js2xmlparser');

const taxService = 'https://ws-dev.shipcompliant.com/services/1.2/TaxService.asmx?WSDL';

const supplierService = 'https://ws-dev.shipcompliant.com/services/1.2/SupplierService.asmx?WSDL';

const coreService = 'https://ws-dev.shipcompliant.com/services/1.2/coreservice.asmx?WSDL';

const user = 'metonymyws@shipcompliant.com';
const pass = 'Password1';

const max = 820454400000;
const min = -725846400000;

// const age = Math.floor(Math.random() * (max - min)) + min
var age = 0;

// for (var i = 0; i < 100; i++) {
//   age = Math.floor(Math.random() * (max - min)) + min
//   console.log(moment(age).format("dddd, MMMM Do YYYY, h:mm:ss a"))
// }



const urls = {
  tax: '/services/1.2/taxservice.asmx',
  supplier: 'services/1.2/SupplierService.asmx'
};

const taxReq = {
  Request: {
    Security: {
      PartnerKey: '',
      Password: pass,
      Username: user,
    },
    Address: {
      Zip1: '90034',
    },
    TaxSaleType: 'Offsite'
  }
};

const supplierReq = {
  Request: {
    Security: {
      PartnerKey: '',
      Password: pass,
      Username: user,
    },
    Address: {
      Zip1: '90034',
    },
    SaleType: 'Offsite'
  }
};

const inventoryReq = {
  Request: {
    Security: {
      PartnerKey: '',
      Password: pass,
      Username: user
    }
  }
};


// ShopifyApp.ready(function () {
//   ShopifyApp.Bar.initialize({
//     title: 'Compliancy Connector',
//   });
//
//
//   <script type="text/javascript">
//     ShopifyApp.init({
//       apiKey: "",
//       shopOrigin: "https://",
//       debug: true
//     });
//   </script>


// IsShippingAvailable
// GetSalesTaxRatesByAddress
// SupplierService
// TaxService



// soap.createClient(taxService, function(err, client) {
//    client
//    .TaxService
//    .TaxServiceSoap12
//    .GetSalesTaxRatesByAddress(taxReq, function(err, result) {
//      if (err || result.GetSalesTaxRatesByAddressResult.Errors) {
//       throw err;
//      }
//      console.log(
//        result.GetSalesTaxRatesByAddressResult.TaxRates.WineSalesTaxPercent
//      );
//    })
// });
//
// soap.createClient(supplierService, function(err, client) {
//    client
//    .SupplierService
//    .SupplierServiceSoap12
//    .IsShippingAvailable(supplierReq, function(err, result) {
//      if (err || result.IsShippingAvailableResult.Errors) {
//       throw err;
//      }
//      console.log(
//        result.IsShippingAvailableResult.IsShippingAvailable
//      );
//    })
// });

soap.createClient(coreService, function (err, client) {
  client
   .CoreService
   .CoreServiceSoap12
   .GetInventoryDetails(supplierReq, function (err, result) {
     if (err || result.GetInventoryDetailsResult.Errors) {
       throw err;
     }
     console.log(
       result.GetInventoryDetailsResult
     );
   });
});
