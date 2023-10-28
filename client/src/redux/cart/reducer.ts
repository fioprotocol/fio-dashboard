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
        return true;
      case actions.ADD_ITEM_SUCCESS:
      case actions.ADD_ITEM_FAILURE:
      case actions.DELETE_ITEM_SUCCESS:
      case actions.DELETE_ITEM_FAILURE:
      case actions.UPDATE_CART_ITEM_PERIOD_SUCCESS:
      case actions.UPDATE_CART_ITEM_PERIOD_FAILURE:
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
      default:
        return state;
    }
  },
  cartItems(state: CartItem[] = [], action = {}) {
    switch (action.type) {
      case actions.ADD_ITEM_SUCCESS:
        return action.data.items;
      case actions.DELETE_ITEM_SUCCESS:
        return action.data.items;
      case actions.CLEAR_CART_SUCCESS:
        return [];
      case action.UPDATE_CART_ITEM_PERIOD_SUCCESS:
        return action.data.items;
      case actions.SET_CART_ITEMS:
        return action.data;
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
  oldCart(state: { [key: string]: CartItem[] } = {}, action = {}) {
    switch (action.type) {
      case actions.SET_OLD_CART:
        return { ...state, [action.data.orderId]: action.data.cart };
      case actions.CLEAR_OLD_CART:
        return {};
      default:
        return state;
    }
  },
});
