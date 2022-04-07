import { combineReducers } from 'redux';

import * as actions from './actions';
import { LOGOUT_SUCCESS } from '../profile/actions';

import { CartItem } from '../../types';

export default combineReducers({
  cartItems(state: CartItem[] = [], action = {}) {
    switch (action.type) {
      case actions.ADD_ITEM:
        return [...state, action.data];
      case actions.DELETE_ITEM:
        if (action.data.cartItems) {
          return action.data.cartItems;
        }
        return state.filter(item => item.id !== action.data.id);
      case actions.CLEAR_CART:
        return [];
      case actions.RECALCULATE_CART:
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
  date(state: number | null = null, action = {}) {
    switch (action.type) {
      case actions.SET_CART_DATE:
        return action.data;
      default:
        return state;
    }
  },
});
