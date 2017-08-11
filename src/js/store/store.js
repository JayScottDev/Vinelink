import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import {
  state,
  date,
  total,
  log,
  shop,
  stateCompliance
} from '../reducers/index.js';
import APIMiddleware from '../middleware/api';

const middleware = routerMiddleware(history);

let store = createStore(
  combineReducers({
    state,
    date,
    total,
    log,
    shop,
    stateCompliance,
    router: routerReducer
  }),
  applyMiddleware(APIMiddleware, logger, middleware)
);

export { store };
