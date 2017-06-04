'use strict';

const soap = require('soap');
const moment = require('moment');
const utils = require('./utils');
const p = utils.promisify;
const _ = require('lodash');
const scShopifyMapping = require('../config/sc_shopify_mapping');

const scMethods = {
  loaded: false
};
async function loadSCMethods () {
  try {
    const coreClient = await p(soap.createClient)(process.env.SC_CORE_URL);
    const supplierClient = await p(soap.createClient)(process.env.SC_SUPPLIER_URL);
    const taxClient = await p(soap.createClient)(process.env.SC_TAX_URL);
    const salesOrderClient = await p(soap.createClient)(process.env.SC_SALESORDER_URL);

    const mapping = {
      getShippingPrefs: p(supplierClient.SupplierService.SupplierServiceSoap12.GetShippingPreferences),
      getVersion: p(supplierClient.SupplierService.SupplierServiceSoap12.GetVersion),
      checkSalesOrder: p(salesOrderClient.SalesOrderService.SalesOrderServiceSoap12.CheckComplianceOfSalesOrder),
      checkComplianceAndCommitSalesOrder: p(salesOrderClient.SalesOrderService.SalesOrderServiceSoap12.CheckComplianceOfAndCommitSalesOrder),
    };
    _.assign(scMethods, mapping);
    // console.log(JSON.stringify(salesOrderClient.describe().SalesOrderService.SalesOrderServiceSoap12.CheckComplianceOfSalesOrder.input, null, 2));

    scMethods.loaded = true;
    console.log('Connected to ShipCompliant and loaded methods');
    return true;
  } catch (e) {
    console.error('Unable to connect to ShipCompliant and load methods.');
    console.error(e);
    console.error('Will retry in 10 seconds.');
    setTimeout(() => {
      console.log('Retrying ShipCompliant connection...');
      loadSCMethods();
    }, 10000);
    return false;
  }
};
loadSCMethods();

class ShipCompClient {
  constructor (username, password, partnerKey) {
    this.username = username;
    this.password = password;
    this.partnerKey = partnerKey;
  }

  async init () {
    let ok = scMethods.loaded;
    if (!ok) {
      ok = await loadSCMethods();
    }
    return ok;
  }

  async getStateCompliancies () {
    try {
      const response = await scMethods.getShippingPrefs({
        Request: {
          Security: {
            PartnerKey: this.partnerKey,
            Username: this.username,
            Password: this.password,
          }
        }
      });
      if (response.GetShippingPreferencesResult.ResponseStatus !== 'Success') {
        return null;
      }

      const compliancies = response.GetShippingPreferencesResult.StateShippingPreferences.StateShippingPreference;
      const dict = {};
      for (let comp of compliancies) {
        const dos = comp.DirectOffsite;
        dict[comp.State] = {
          compliant: dos.Enabled && dos.ComplianceStatus === 'Compliant',
          override: dos.ComplianceStatus === 'RuleBypassed' ? 'auto' : null
        };
      }
      return dict;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  // Test method for verifying sc credentials and for checking sc connection

  async test () {
    try {
      const response = await scMethods.getVersion({
        Request: {
          Security: {
            PartnerKey: '', //this.partnerKey,
            Password: this.password,
            Username: this.username,
          }
        }
      });
      if (!response.GetVersionResult) {
        console.log('ERROR ---->', response);
        return null;
      }

      const version = response.GetVersionResult;
      console.log('VERSION', version);
      return true;

    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async checkComplianceAndCommitSalesOrder (shopifyOrder) {
    const requestObj = transformToRequest('order', shopifyOrder);
    _.set(requestObj, 'Request.Security', {
      PartnerKey: this.partnerKey,
      Username: this.username,
      Password: this.password
    });
    requestObj.Request.CommitOption = 'AllShipments';
    requestObj.Request.AddressOption = { IgnoreStreetLevelErrors: true };
    requestObj.Request.SalesOrder.OrderType = 'Internet';
    requestObj.Request.SalesOrder.Payments.Payment.Type = 'CreditCard';
    requestObj.Request.SalesOrder.Shipments.Shipment.ShipmentStatus = 'PaymentAccepted';
    requestObj.Request.SalesOrder.Shipments.Shipment.LicenseRelationship = 'SupplierToConsumer';
    requestObj.Request.SalesOrder.Shipments.Shipment.ShipDate = moment().format();
    requestObj.Request.SalesOrder.Shipments.Shipment.ShippingService = 'OTHER'; // Valid services: { FEDEX, UPS, OTHER }

    const response = await scMethods.checkComplianceAndCommitSalesOrder(requestObj);
    const status = _.get(response, 'CheckComplianceOfAndCommitSalesOrderResult.ResponseStatus');
    // console.log(JSON.stringify(response, null, 2));
    const result = {
      success: _.get(response, 'CheckComplianceOfAndCommitSalesOrderResult.ResponseStatus') === 'Success',
      compliant: _.get(response, 'CheckComplianceOfAndCommitSalesOrderResult.SalesOrder.IsCompliant') === true,
      errors: _.get(response, 'CheckComplianceOfAndCommitSalesOrderResult.Errors') || null,
      sales_order_key: _.get(response, 'CheckComplianceOfAndCommitSalesOrderResult.SalesOrder.Key')
    }
    return result;
  }
}

module.exports.createClient = async (username, password) => {
  const partnerKey = process.env.SC_PARTNER_KEY;
  const client = new ShipCompClient(username, password, partnerKey);
  const ok = await client.init();
  if (!ok) {
    return null;
  }
  return client;
};

module.exports.scMethods = scMethods;

function transformToRequest (requestName, data) {
  const transformed = {};
  const { map, arrays } = scShopifyMapping[requestName];
  for (let key in map) {
    _.set(transformed, key, _.get(data, map[key]));
  }
  for (let compound in arrays) {
    const keys = compound.split(':');
    const scKey = keys[0];
    const shopKey = keys[1];
    const array = _.get(data, shopKey).map(obj => {
      const returnObj = {};
      for (let key in arrays[compound]) {
        returnObj[key] = obj[arrays[compound][key]];
      }
      return returnObj;
    });
    _.set(transformed, scKey, array);
  }
  return transformed;
}
