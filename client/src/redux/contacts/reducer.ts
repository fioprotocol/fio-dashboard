import { combineReducers } from 'redux';

import { LOGOUT_SUCCESS } from '../profile/actions';
import * as actions from './actions';

export default combineReducers({
  loading(state: boolean = false, action) {
    switch (action.type) {
      case actions.LIST_REQUEST:
        return true;
      case actions.LIST_SUCCESS:
      case actions.LIST_FAILURE:
        return false;
      default:
        return state;
    }
  },
  list(state: string[] = [], action) {
    switch (action.type) {
      case actions.LIST_SUCCESS:
        return [...action.data];
      case actions.CREATE_SUCCESS:
        return action.data ? [action.data, ...state] : state;
      case LOGOUT_SUCCESS:
        return [];
      default:
        return state;
    }
  },
});
