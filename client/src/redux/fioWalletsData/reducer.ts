import { combineReducers } from 'redux';
import { UsersFioWalletsData } from '../../types';
import * as actions from './actions';

export default combineReducers({
  walletsData(state: UsersFioWalletsData = {}, action) {
    switch (action.type) {
      case actions.UPDATE_WALLET_DATA: {
        const userWalletState = state[action.userId] || {};

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
});
