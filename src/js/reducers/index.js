import { combineReducers } from 'redux'

const FETCH_STATE_REQUEST = 'FETCH_STATE_REQUEST'
const FETCH_STATE_SUCCESS = 'FETCH_STATE_SUCCESS'
const FETCH_STATE_FAILURE = 'FETCH_STATE_FAILURE'
const FETCH_DATE_REQUEST = 'FETCH_DATE_REQUEST'
const FETCH_DATE_SUCCESS = 'FETCH_DATE_SUCCESS'
const FETCH_DATE_FAILURE = 'FETCH_DATE_FAILURE'
const FETCH_TOTAL_REQUEST = 'FETCH_TOTAL_REQUEST'
const FETCH_TOTAL_SUCCESS = 'FETCH_TOTAL_SUCCESS'
const FETCH_TOTAL_FAILURE = 'FETCH_TOTAL_FAILURE'

const initialState = {
  isLoading: false,
  err: false,
}


const stateHandlers = {
  [FETCH_STATE_REQUEST]: (state, action) => {
    return Object.assign({}, state, {
      isLoading: true,
    })
  },
  [FETCH_STATE_SUCCESS]: (state, action) => {
    return Object.assign({}, state, {
      isLoading: false,
      data: action.response.data,
    })
  },
  [FETCH_STATE_FAILURE]: (state, action) => {
    return Object.assign({}, state, {
      isLoading: false,
      err: action.error,
    })
  }
};

const state = (state = initialState, action) => {
  if (stateHandlers[action.type]) {
    return stateHandlers[action.type](state, action)
  }
  return state;
};


const dateHandlers = {
  [FETCH_DATE_REQUEST]: (state, action) => {
    return Object.assign({}, state, {
      isLoading: true,
    })
  },
  [FETCH_DATE_SUCCESS]: (state, action) => {
    return Object.assign({}, state, {
      isLoading: false,
      data: action.response.data,
    })
  },
  [FETCH_DATE_FAILURE]: (state, action) => {
    return Object.assign({}, state, {
      isLoading: false,
      err: action.error,
    })
  }
};

const date = (state = initialState, action) => {
  if (dateHandlers[action.type]) {
    return dateHandlers[action.type](state, action)
  }
  return state;
};


const totalHandlers = {
  [FETCH_TOTAL_REQUEST]: (state, action) => {
    return Object.assign({}, state, {
      isLoading: true,
    })
  },
  [FETCH_TOTAL_SUCCESS]: (state, action) => {
    return Object.assign({}, state, {
      isLoading: false,
      data: action.response.data,
    })
  },
  [FETCH_TOTAL_FAILURE]: (state, action) => {
    return Object.assign({}, state, {
      isLoading: false,
      err: action.error,
    })
  }
};

const total = (state = initialState, action) => {
  if (totalHandlers[action.type]) {
    return totalHandlers[action.type](state, action)
  }
  return state;
};


export default combineReducers({
  state, date, total
})
