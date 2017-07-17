const _ = require('lodash');
const request = require('request-promise');
const cache = require('./redis').client;

const key_prefix = 'ziptostate:';
const getStateFromCache = async zip => {
  const key = `${key_prefix}${zip}`;
  return await cache.getAsync(key);
};

const cacheResult = async (zip, state) => {
  const key = `${key_prefix}${zip}`;
  cache.setAsync(key, state);
};

const getStateExternally = async zip => {
  const respBody = await request({
    method: 'GET',
    uri: 'https://maps.googleapis.com/maps/api/geocode/json',
    qs: {
      key: process.env.GOOGLE_GEOCODE_API_KEY,
      address: `${zip}+United States`
    },
    json: true
  });

  const addrComponents = _.get(respBody, 'results[0].address_components');

  // validate input zip
  const zipComponent = addrComponents.filter(comp =>
    comp.types.some(type => type === 'postal_code')
  );
  const isZip = zipComponent.length
    ? zipComponent[0].short_name === String(zip)
    : false;
  if (!isZip) return null;

  // validate country
  const countryComponent = addrComponents.filter(comp =>
    comp.types.some(type => type === 'country')
  );
  const isUSA = countryComponent.length
    ? countryComponent[0].short_name === 'US'
    : false;
  if (!isUSA) return null;

  // parse out state from address object
  const filteredComponents = addrComponents.filter(comp =>
    comp.types.some(type => type === 'administrative_area_level_1')
  );
  const state = _.get(filteredComponents, '[0].short_name');
  return state;
};

module.exports = async zip => {
  let state = await getStateFromCache(zip);
  if (!state) {
    state = await getStateExternally(zip);

    if (state) {
      cacheResult(zip, state);
    }
  }

  return state;
};
