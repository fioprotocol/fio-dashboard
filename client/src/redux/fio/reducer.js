import { combineReducers } from 'redux';
import { REFRESH_FIO_WALLETS_SUCCESS } from '../edge/actions';
import * as actions from './actions';

const emptyWallet = {
  id: '',
  name: '',
  publicKey: '',
  balance: 0,
};

export default combineReducers({
  loading(state = false, action) {
    switch (action.type) {
      case actions.REFRESH_BALANCE_REQUEST:
        return true;
      case actions.REFRESH_BALANCE_SUCCESS:
      case actions.REFRESH_BALANCE_FAILURE:
        return false;
      default:
        return state;
    }
  },
  fioWallets(state = [], action) {
    switch (action.type) {
      case REFRESH_FIO_WALLETS_SUCCESS: {
        return action.data.map(fioWallet => ({
          ...emptyWallet,
          id: fioWallet.id,
          publicKey: fioWallet.publicWalletInfo.keys.publicKey,
          name: fioWallet.name,
        }));
      }
      case actions.REFRESH_BALANCE_SUCCESS: {
        return state.map(fioWallet =>
          fioWallet.publicKey === action.publicKey
            ? {
                ...fioWallet,
                balance: action.data,
              }
            : fioWallet,
        );
      }
      default:
        return state;
    }
  },
});
