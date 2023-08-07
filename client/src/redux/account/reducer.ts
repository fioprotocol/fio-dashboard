import { combineReducers } from 'redux';

import * as actions from './actions';

export default combineReducers({
  loading(state: boolean = false, action) {
    switch (action.type) {
      case actions.SET_WALLETS_REQUEST:
        return true;
      case actions.SET_WALLETS_SUCCESS:
      case actions.SET_WALLETS_FAILURE:
        return false;
      default:
        return state;
    }
  },
  addWalletLoading(state: boolean = false, action) {
    switch (action.type) {
      case actions.ADD_WALLET_REQUEST:
        return true;
      case actions.ADD_WALLET_SUCCESS:
      case actions.ADD_WALLET_FAILURE:
        return false;
      default:
        return state;
    }
  },
  isWalletCreated(state: boolean = false, action) {
    switch (action.type) {
      case actions.ADD_WALLET_REQUEST:
      case actions.ADD_WALLET_FAILURE:
        return false;
      case actions.ADD_WALLET_SUCCESS:
        return true;
      case actions.TOGGLE_IS_WALLET_CREATED: {
        return action.isCreated;
      }
      default:
        return state;
    }
  },
});
