import { combineReducers } from 'redux';

import * as actions from './actions';

import { Prices } from '../../types';
import { DomainsResponse } from '../../api/responses';

const PRICES_DEFAULT: Prices = {
  fio: { address: 0, domain: 0 },
  nativeFio: { addBundles: 0, address: 0, domain: 0, renewDomain: 0, combo: 0 },
  usdt: { address: 0, domain: 0 },
};

export default combineReducers({
  loadingArray(state: string[] = [], action) {
    switch (action.type) {
      case actions.PRICES_REQUEST:
      case actions.DOMAINS_REQUEST:
      case actions.API_URLS_REQUEST:
        return [...state, action.type];
      case actions.PRICES_FAILURE:
      case actions.PRICES_SUCCESS:
      case actions.DOMAINS_FAILURE:
      case actions.DOMAINS_SUCCESS:
      case actions.API_URLS_SUCCESS:
      case actions.API_URLS_FAILURE:
        return state.filter(
          type =>
            type !== action.type.replace(/_FAILURE|_SUCCESS/gi, '_REQUEST'),
        );
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
  prices(state: Prices = PRICES_DEFAULT, action) {
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
  domains(state: DomainsResponse[] = [], action) {
    switch (action.type) {
      case actions.DOMAINS_SUCCESS:
        return action.data;
      default:
        return state;
    }
  },
  hasGetPricesError(state: boolean = false, action) {
    switch (action.type) {
      case actions.PRICES_FAILURE: {
        return true;
      }
      case actions.PRICES_REQUEST:
      case actions.PRICES_SUCCESS:
        return false;
      default:
        return state;
    }
  },
  apiUrls(state: string[] = [], action) {
    switch (action.type) {
      case actions.API_URLS_SUCCESS: {
        return action.data;
      }
      default:
        return state;
    }
  },
});
