import { combineReducers } from 'redux';

import * as actions from './actions';

import { AdminUser } from '../../types';

export default combineReducers({
  loading(state: boolean = false, action) {
    switch (action.type) {
      case actions.GET_ADMIN_USERS_REQUEST:
      case actions.DELETE_ADMIN_USER_REQUEST:
        return true;
      case actions.GET_ADMIN_USERS_SUCCESS:
      case actions.GET_ADMIN_USERS_FAILURE:
      case actions.DELETE_ADMIN_USER_SUCCESS:
      case actions.DELETE_ADMIN_USER_FAILURE:
        return false;
      default:
        return state;
    }
  },
  adminUsersList(state: AdminUser[] = [], action) {
    switch (action.type) {
      case actions.GET_ADMIN_USERS_SUCCESS:
        return [...action.data];
      case actions.GET_ADMIN_USERS_FAILURE:
        return state;
      case actions.DELETE_ADMIN_USER_SUCCESS:
        return state.filter(adminUser => adminUser.id !== action.adminUserId);
      default:
        return state;
    }
  },
});
