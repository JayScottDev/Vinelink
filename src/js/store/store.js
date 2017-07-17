import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import reducer from '../reducers/index.js';
import APIMiddleware from '../middleware/api';

let store = createStore(reducer, applyMiddleware(APIMiddleware, logger));

export { store };
