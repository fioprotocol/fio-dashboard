import { combineReducers } from 'redux';
import * as actions from './actions';

const PRICES_DEFAULT = {
  fio: { address: 0, domain: 0 },
  usdt: { address: 0, domain: 0 },
};
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
  prices(state = PRICES_DEFAULT, action) {
    switch (action.type) {
      case actions.PRICES_SUCCESS:
        return action.data.pricing;
      case actions.PRICES_REQUEST:
        return PRICES_DEFAULT;
      default:
        return state;
    }
  },
  domains(state = [], action) {
    switch (action.type) {
      case actions.DOMAINS_SUCCESS:
        return action.data.domains;
      case actions.DOMAINS_REQUEST:
        return [];
      default:
        return state;
    }
  },
});
