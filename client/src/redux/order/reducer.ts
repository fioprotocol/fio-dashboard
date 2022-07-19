import { combineReducers } from 'redux';

import * as actions from './actions';
import { LOGOUT_SUCCESS } from '../profile/actions';

import { Order } from '../../types';

export default combineReducers({
  order(state: Order | null = null, action = {}) {
    switch (action.type) {
      case actions.CREATE_SUCCESS:
        return action.data;
      case LOGOUT_SUCCESS:
        return null;
      default:
        return state;
    }
  },
});
