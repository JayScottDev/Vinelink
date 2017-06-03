'use strict';

const soap = require('soap');
const utils = require('./utils');
const p = utils.promisify;
const _ = require('lodash');

const scMethods = {
  loaded: false
};
async function loadSCMethods () {
  try {
    const coreClient = await p(soap.createClient)(process.env.SC_CORE_URL);
    const supplierClient = await p(soap.createClient)(
      process.env.SC_SUPPLIER_URL
    );
    const taxClient = await p(soap.createClient)(process.env.SC_TAX_URL);
    const productClient = await p(soap.createClient)(
      process.env.SC_PRODUCT_URL
    );

    const mapping = {
      getShippingPrefs: p(
        supplierClient.SupplierService.SupplierServiceSoap12
          .GetShippingPreferences
      ),
      getVersion: p(
        supplierClient.SupplierService.SupplierServiceSoap12.GetVersion
      ),
      getInventory: p(
        productClient.ProductService.ProductServiceSoap12.GetInventoryDetails
      )
    };
    _.assign(scMethods, mapping);

    scMethods.loaded = true;
    return true;
  } catch (e) {
    console.error('Unable to connect to Ship Compliant and load methods.');
    console.error(e);
    return false;
  }
}
loadSCMethods();

class ShipCompClient {
  constructor (username, password, partnerKey) {
    this.username = username;
    this.password = password;
    this.partnerKey = ''; //partnerKey
    console.log('CREDENTIALS', username, password);
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
            PartnerKey: '', //this.partnerKey,
            Password: this.password,
            Username: this.username
          }
        }
      });
      if (response.GetShippingPreferencesResult.ResponseStatus !== 'Success') {
        console.log(
          'RESPONSE',
          response.GetShippingPreferencesResult.Errors.Error
        );
        return null;
      }

      const compliancies =
        response.GetShippingPreferencesResult.StateShippingPreferences
          .StateShippingPreference;
      console.log('COMPLIANCIES', compliancies);
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
            Username: this.username
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

  async getInventory () {
    console.log('PASSWORD', this.password);
    console.log('USERNAME', this.username);

    try {
      const response = await scMethods.getInventory({
        Request: {
          Security: {
            PartnerKey: '',
            Password: this.password,
            Username: this.username
          }
        }
      });
      if (response.GetInventoryDetailsResult.ResponseStatus !== 'Success') {
        console.log(
          'RESPONSE',
          response.GetInventoryDetailsResult.Errors.Error
        );
      }
      return response.GetInventoryDetailsResult.InventoryLocations
        .InventoryLocation;
    } catch (e) {
      console.log('ERROR: ', e);
      return null;
    }
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
