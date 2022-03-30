import { combineReducers } from 'redux';

import { LOGOUT_SUCCESS } from '../profile/actions';
import * as actions from './actions';

import { Domain, Prices } from '../../types';

const PRICES_DEFAULT: Prices = {
  fio: { address: 0, domain: 0 },
  nativeFio: { address: 0, domain: 0 },
  usdt: { address: 0, domain: 0 },
};

export default combineReducers({
  loading(state: boolean = false, action) {
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
      case actions.PRICES_SUCCESS: {
        const prices = { ...action.data.pricing };
        delete prices.usdtRoe;
        return prices;
      }
      default:
        return state;
    }
  },
  roe(state: number | null = null, action) {
    switch (action.type) {
      case actions.PRICES_SUCCESS:
        return action.data.pricing.usdtRoe;
      default:
        return state;
    }
  },
  roeSetDate(state: Date = new Date(), action) {
    switch (action.type) {
      case actions.PRICES_SUCCESS:
        return new Date();
      default:
        return state;
    }
  },
  domains(state: Domain[] = [], action) {
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
      case LOGOUT_SUCCESS:
        return {};
      default:
        return state;
    }
  },
});
