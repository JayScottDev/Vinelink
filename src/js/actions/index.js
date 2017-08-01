import fetch from 'isomorphic-fetch';

const fetchLogsState = path => {
  return {
    types: [
      'FETCH_STATE_REQUEST',
      'FETCH_STATE_SUCCESS',
      'FETCH_STATE_FAILURE'
    ],
    shouldCallAPI: state => true,
    callAPI: () =>
      fetch(path, {
        credentials: 'same-origin'
      }),
    payload: {}
  };
};

const fetchLogsDate = path => {
  return {
    types: ['FETCH_DATE_REQUEST', 'FETCH_DATE_SUCCESS', 'FETCH_DATE_FAILURE'],
    shouldCallAPI: state => true,
    callAPI: () =>
      fetch(path, {
        credentials: 'same-origin'
      }),
    payload: {}
  };
};

const fetchLogsTotal = path => {
  return {
    types: [
      'FETCH_TOTAL_REQUEST',
      'FETCH_TOTAL_SUCCESS',
      'FETCH_TOTAL_FAILURE'
    ],
    shouldCallAPI: state => true,
    callAPI: () =>
      fetch(path, {
        credentials: 'same-origin'
      }),
    payload: {}
  };
};

const fetchLogsLog = path => {
  return {
    types: ['FETCH_LOG_REQUEST', 'FETCH_LOG_SUCCESS', 'FETCH_LOG_FAILURE'],
    shouldCallAPI: state => true,
    callAPI: () =>
      fetch(path, {
        credentials: 'same-origin'
      }),
    payload: {}
  };
};

const fetchShopInfo = path => {
  return {
    types: ['FETCH_SHOP_REQUEST', 'FETCH_SHOP_SUCCESS', 'FETCH_SHOP_FAILURE'],
    shouldCallAPI: state => true,
    callAPI: () =>
      fetch(path, {
        credentials: 'same-origin'
      }),
    payload: {}
  };
};

export {
  fetchLogsState,
  fetchLogsDate,
  fetchLogsTotal,
  fetchLogsLog,
  fetchShopInfo
};
