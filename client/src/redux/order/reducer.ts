import { combineReducers } from 'redux';

import * as actions from './actions';
import { LOGOUT_SUCCESS } from '../profile/actions';

import { ApiError, Order } from '../../types';

export default combineReducers({
  order(state: Order | null = null, action = {}) {
    switch (action.type) {
      case actions.CREATE_REQUEST:
        return null;
      case actions.CREATE_SUCCESS:
        return action.data;
      case LOGOUT_SUCCESS:
        return null;
      default:
        return state;
    }
  },
  error(state: ApiError = null, action = {}) {
    switch (action.type) {
      case actions.CREATE_REQUEST:
        return null;
      case actions.CREATE_FAILURE:
        return action.error;
      case LOGOUT_SUCCESS:
        return null;
      default:
        return state;
    }
  },
});
