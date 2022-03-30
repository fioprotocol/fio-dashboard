import { combineReducers } from 'redux';
import isEqual from 'lodash/isEqual';

import { UsersFioWalletsData, UsersWalletsTxHistory } from '../../types';
import * as actions from './actions';

export default combineReducers({
  walletsData(state: UsersFioWalletsData = {}, action) {
    switch (action.type) {
      case actions.UPDATE_WALLET_DATA: {
        const userWalletState = state[action.userId] || {};

        if (isEqual(userWalletState[action.publicKey], action.data))
          return state;

        return {
          ...state,
          [action.userId]: {
            ...userWalletState,
            [action.publicKey]: action.data,
          },
        };
      }
      default:
        return state;
    }
  },
  walletsTxHistory(state: UsersWalletsTxHistory = {}, action) {
    switch (action.type) {
      case actions.UPDATE_WALLET_TX_HISTORY: {
        const userWalletState = state[action.userId] || {};

        if (isEqual(userWalletState[action.publicKey], action.data))
          return state;

        return {
          ...state,
          [action.userId]: {
            ...userWalletState,
            [action.publicKey]: action.data,
          },
        };
      }
      default:
        return state;
    }
  },
  walletDataPublicKey(state: string = '', action) {
    switch (action.type) {
      case actions.REFRESH_WALLET_DATA_PUBLIC_KEY: {
        return action.publicKey;
      }
      default:
        return state;
    }
  },
});
