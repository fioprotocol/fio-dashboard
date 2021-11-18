import { combineReducers } from 'redux';
import * as actions from './actions';

export default combineReducers({
  loading(state = false, action) {
    switch (action.type) {
      case actions.SET_WALLETS_REQUEST:
      case actions.ADD_WALLET_REQUEST:
        return true;
      case actions.SET_WALLETS_SUCCESS:
      case actions.SET_WALLETS_FAILURE:
      case actions.ADD_WALLET_SUCCESS:
      case actions.ADD_WALLET_FAILURE:
        return false;
      default:
        return state;
    }
  },
});
