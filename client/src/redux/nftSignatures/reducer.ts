import { combineReducers } from 'redux';
import { NftItem } from '@fioprotocol/fiosdk/src/entities/NftItem';
import * as actions from './actions';

export default combineReducers({
  list(state: NftItem[] = [], action) {
    switch (action.type) {
      case actions.FIO_SIGNATURE_ADDRESS_SUCCESS:
        return [...action.data.nfts];
      default:
        return state;
    }
  },
});
