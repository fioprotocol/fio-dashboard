import { combineReducers } from 'redux';
import { FioWalletData } from '../../types';
import * as actions from './actions';

export default combineReducers({
  walletsData(state: Record<string, FioWalletData> = {}, action) {
    switch (action.type) {
      case actions.UPDATE_WALLET_DATA:
        return { ...state, [action.publicKey]: action.data };
      default:
        return state;
    }
  },
});
