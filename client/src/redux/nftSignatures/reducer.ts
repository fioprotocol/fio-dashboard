import { combineReducers } from 'redux';
import { NFTSignature } from './types';
import * as actions from './actions';
export default combineReducers({
  list(state: NFTSignature[] = [], action) {
    switch (action.type) {
      case actions.FIO_SIGNATURE_ADDRESS_SUCCESS:
        return [...action.data];
      default:
        return state;
    }
  },
});
