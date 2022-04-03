import { combineReducers } from 'redux';

import { LOGOUT_SUCCESS, SET_RECOVERY_SUCCESS } from '../profile/actions';
import * as actions from './actions';

import { Notification } from '../../types';

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
  list(state: Notification[] = [], action) {
    switch (action.type) {
      case actions.LIST_SUCCESS:
        return [
          ...state.filter(notification => notification.isManual),
          ...action.data,
        ].sort((a, b) =>
          new Date(a.createdAt).getTime() < new Date(b.createdAt).getTime()
            ? 1
            : -1,
        );
      case actions.UPDATE_SUCCESS:
        return state.map(notification =>
          notification.id === action.id ? action.data : notification,
        );
      case actions.MANUAL_REMOVE:
        return state.filter(notification => notification.id !== action.data.id);
      case actions.MANUAL_CREATE:
      case actions.CREATE_SUCCESS:
        return action.data ? [action.data, ...state] : state;
      case SET_RECOVERY_SUCCESS:
        return [];
      case LOGOUT_SUCCESS:
        return [];
      default:
        return state;
    }
  },
});
