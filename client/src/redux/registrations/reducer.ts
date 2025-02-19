import { combineReducers } from 'redux';

import * as actions from './actions';
import * as cartActions from '../cart/actions';
import {
  GET_SITE_SETTINGS_REQUEST,
  GET_SITE_SETTINGS_FAILURE,
  GET_SITE_SETTINGS_SUCCESS,
} from '../settings/actions';

import MathOp from '../../util/math';

import { Prices, Roe } from '../../types';
import { DomainsResponse } from '../../api/responses';

const PRICES_DEFAULT: Prices = {
  fio: { address: '0', domain: '0' },
  nativeFio: {
    addBundles: '0',
    address: '0',
    domain: '0',
    renewDomain: '0',
    combo: '0',
  },
  usdt: { address: '0', domain: '0' },
};

export default combineReducers({
  loadingArray(state: string[] = [], action) {
    switch (action.type) {
      case actions.PRICES_REQUEST:
      case actions.DOMAINS_REQUEST:
      case actions.API_URLS_REQUEST:
      case GET_SITE_SETTINGS_REQUEST:
        return [...state, action.type];
      case actions.PRICES_FAILURE:
      case actions.PRICES_SUCCESS:
      case actions.DOMAINS_FAILURE:
      case actions.DOMAINS_SUCCESS:
      case actions.API_URLS_SUCCESS:
      case actions.API_URLS_FAILURE:
      case GET_SITE_SETTINGS_SUCCESS:
      case GET_SITE_SETTINGS_FAILURE:
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
      case cartActions.ADD_ITEM_SUCCESS:
      case cartActions.DELETE_ITEM_SUCCESS:
      case cartActions.GET_CART_REQUEST_SUCCESS:
      case cartActions.RECALCULATE_CART_ITEMS_ON_PRICES_UPDATE_SUCCESS:
      case cartActions.UPDATE_CART_ITEM_PERIOD_SUCCESS:
      case cartActions.HANDLE_USERS_FREE_CART_ITEMS_SUCCESS: {
        // Update prices based on prices set in the cart
        if (action.data?.options?.prices)
          return { nativeFio: { ...action.data.options.prices } };

        return state;
      }
      default:
        return state;
    }
  },
  roe(state: Roe = null, action) {
    switch (action.type) {
      case actions.PRICES_SUCCESS:
        return action.data.pricing.usdtRoe;
      case cartActions.ADD_ITEM_SUCCESS:
      case cartActions.DELETE_ITEM_SUCCESS:
      case cartActions.GET_CART_REQUEST_SUCCESS:
      case cartActions.RECALCULATE_CART_ITEMS_ON_PRICES_UPDATE_SUCCESS:
      case cartActions.UPDATE_CART_ITEM_PERIOD_SUCCESS:
      case cartActions.HANDLE_USERS_FREE_CART_ITEMS_SUCCESS: {
        // Update roe based on roe set in the cart
        if (action.data?.options?.roe)
          return new MathOp(action.data.options.roe).toString();

        return state;
      }
      default:
        return state;
    }
  },
  roeSetDate(state: Date = new Date(), action) {
    switch (action.type) {
      case actions.PRICES_SUCCESS:
        return new Date();
      case cartActions.ADD_ITEM_SUCCESS:
      case cartActions.DELETE_ITEM_SUCCESS:
      case cartActions.GET_CART_REQUEST_SUCCESS:
      case cartActions.RECALCULATE_CART_ITEMS_ON_PRICES_UPDATE_SUCCESS:
      case cartActions.UPDATE_CART_ITEM_PERIOD_SUCCESS:
      case cartActions.HANDLE_USERS_FREE_CART_ITEMS_SUCCESS: {
        if (action.data?.options?.roe) return new Date();

        return state;
      }
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
