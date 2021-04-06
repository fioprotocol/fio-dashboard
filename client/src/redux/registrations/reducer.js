import { combineReducers } from 'redux';
import * as actions from './actions';

export default combineReducers({
  loading(state = false, action) {
    switch (action.type) {
      case actions.PRICES_REQUEST:
      case actions.DOMAINS_REQUEST:
        return true;
      case actions.PRICES_FAILURE:
      case actions.PRICES_SUCCESS:
      case actions.DOMAINS_FAILURE:
      case actions.DOMAINS_SUCCESS:
        return false;
      default:
        return state;
    }
  },
  prices(state = {}, action) {
    switch (action.type) {
      case actions.PRICES_SUCCESS:
        return action.data;
      case actions.PRICES_REQUEST:
        return {};
      default:
        return state;
    }
  },
  domains(state = [], action) {
    switch (action.type) {
      case actions.DOMAINS_SUCCESS:
        return action.data;
      case actions.DOMAINS_REQUEST:
        return [];
      default:
        return state;
    }
  },
});
