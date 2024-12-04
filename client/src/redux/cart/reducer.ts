import { combineReducers } from 'redux';

import * as actions from './actions';
import { LOGOUT_SUCCESS } from '../profile/actions';

import { CartItem } from '../../types';

export default combineReducers({
  loading(state: boolean = false, action = {}) {
    switch (action.type) {
      case actions.ADD_ITEM_REQUEST:
      case actions.DELETE_ITEM_REQUEST:
      case actions.UPDATE_CART_ITEM_PERIOD_REQUEST:
      case actions.HANDLE_USERS_FREE_CART_ITEMS_REQUEST:
      case actions.GET_CART_REQUEST_REQUEST:
      case actions.RECALCULATE_CART_ITEMS_ON_PRICES_UPDATE_REQUEST:
      case actions.CREATE_CART_FROM_ORDER_REQUEST:
        return true;
      case actions.ADD_ITEM_SUCCESS:
      case actions.ADD_ITEM_FAILURE:
      case actions.DELETE_ITEM_SUCCESS:
      case actions.DELETE_ITEM_FAILURE:
      case actions.UPDATE_CART_ITEM_PERIOD_SUCCESS:
      case actions.UPDATE_CART_ITEM_PERIOD_FAILURE:
      case actions.HANDLE_USERS_FREE_CART_ITEMS_SUCCESS:
      case actions.HANDLE_USERS_FREE_CART_ITEMS_FAILURE:
      case actions.GET_CART_REQUEST_SUCCESS:
      case actions.GET_CART_REQUEST_FAILURE:
      case actions.RECALCULATE_CART_ITEMS_ON_PRICES_UPDATE_SUCCESS:
      case actions.RECALCULATE_CART_ITEMS_ON_PRICES_UPDATE_FAILURE:
      case actions.CREATE_CART_FROM_ORDER_SUCCESS:
      case actions.CREATE_CART_FROM_ORDER_FAILURE:
        return false;
      default:
        return state;
    }
  },
  cartId(state: string | null = null, action = {}) {
    switch (action.type) {
      case actions.ADD_ITEM_SUCCESS:
        return action.data.id;
      case actions.CLEAR_CART_SUCCESS:
        return null;
      case actions.DELETE_ITEM_SUCCESS: {
        if (action.data.items?.length === 0) {
          return null;
        }
        return state;
      }
      case actions.GET_CART_REQUEST_SUCCESS: {
        if (action.data.items?.length === 0) {
          return null;
        }
        return action.data.id;
      }
      case actions.CREATE_CART_FROM_ORDER_SUCCESS: {
        return action.data.id;
      }
      default:
        return state;
    }
  },
  cartItems(state: CartItem[] = [], action = {}) {
    switch (action.type) {
      case actions.ADD_ITEM_SUCCESS:
      case actions.DELETE_ITEM_SUCCESS:
      case actions.UPDATE_CART_ITEM_PERIOD_SUCCESS:
      case actions.HANDLE_USERS_FREE_CART_ITEMS_SUCCESS:
      case actions.GET_CART_REQUEST_SUCCESS:
      case actions.RECALCULATE_CART_ITEMS_ON_PRICES_UPDATE_SUCCESS:
      case actions.CREATE_CART_FROM_ORDER_SUCCESS:
        return action.data.items;
      case actions.CLEAR_CART_SUCCESS:
        return [];
      default:
        return state;
    }
  },
  paymentWalletPublicKey(state: string = '', action = {}) {
    switch (action.type) {
      case actions.SET_WALLET_FOR_PAYMENT:
        return action.data;
      case actions.UNSET_WALLET_FOR_PAYMENT:
        return '';
      case LOGOUT_SUCCESS:
        return '';
      default:
        return state;
    }
  },
});
