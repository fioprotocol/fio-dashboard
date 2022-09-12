import { combineReducers } from 'redux';

import * as actions from './actions';
import { LOGOUT_SUCCESS } from '../profile/actions';

import { ApiError, Order } from '../../types';

export default combineReducers({
  order(state: Order | null = null, action = {}) {
    switch (action.type) {
      case actions.CREATE_ORDER_REQUEST:
      case actions.CLEAR_ORDER:
        return null;
      case actions.CREATE_ORDER_SUCCESS:
        return action.data;
      case LOGOUT_SUCCESS:
        return null;
      default:
        return state;
    }
  },
  orderLoading(state: boolean = false, action = {}) {
    switch (action.type) {
      case actions.CREATE_ORDER_REQUEST:
        return true;
      case actions.CREATE_ORDER_SUCCESS:
      case actions.CREATE_ORDER_FAILURE:
        return false;
      case LOGOUT_SUCCESS:
        return false;
      default:
        return state;
    }
  },
  error(state: ApiError = null, action = {}) {
    switch (action.type) {
      case actions.CREATE_ORDER_REQUEST:
        return null;
      case actions.CREATE_ORDER_FAILURE:
        return action.error;
      case LOGOUT_SUCCESS:
        return null;
      default:
        return state;
    }
  },
});
