import { combineReducers } from 'redux';
import * as actions from './actions';

const PRICES_DEFAULT = {
  fio: { address: 0, domain: 0 },
  fioNative: { address: 0, domain: 0 },
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
  isProcessing(state = false, action) {
    switch (action.type) {
      case actions.SET_PROCESSING:
        return action.data;
      default:
        return state;
    }
  },
  prices(state = PRICES_DEFAULT, action) {
    switch (action.type) {
      case actions.PRICES_SUCCESS:
        return action.data.pricing;
      default:
        return state;
    }
  },
  domains(state = [], action) {
    switch (action.type) {
      case actions.DOMAINS_SUCCESS:
        return action.data.domains;
      default:
        return state;
    }
  },
  captchaResult(state = {}, action) {
    switch (action.type) {
      case actions.CAPTCHA_SUCCESS:
        return action.data;
      case actions.CAPTCHA_REQUEST:
        return {};
      case actions.CAPTCHA_FAILURE:
        return { success: false };
      default:
        return state;
    }
  },
  captchaResolving(state = false, action) {
    switch (action.type) {
      case actions.CAPTCHA_REQUEST:
        return true;
      case actions.CAPTCHA_SUCCESS:
      case actions.CAPTCHA_FAILURE:
        return false;
      default:
        return state;
    }
  },
  registrationResult(state = {}, action) {
    switch (action.type) {
      case actions.SET_REGISTRATION_RESULTS:
        return action.data;
      default:
        return state;
    }
  },
});
