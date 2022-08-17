import { combineReducers } from 'redux';

import * as actions from './actions';

import {
  AdminUser,
  AdminUserProfile,
  FioAccountProfile,
  OrderItem,
} from '../../types';

export default combineReducers({
  loading(state: boolean = false, action) {
    switch (action.type) {
      case actions.GET_ADMIN_USERS_REQUEST:
      case actions.DELETE_ADMIN_USER_REQUEST:
      case actions.GET_ORDERS_LIST_BY_ADMIN_REQUEST:
      case actions.GET_ORDER_BY_ADMIN_REQUEST:
      case actions.GET_ADMIN_USER_PROFILE_REQUEST:
      case actions.GET_FIO_ACCOUNTS_PROFILES_REQUEST:
        return true;
      case actions.GET_ADMIN_USERS_SUCCESS:
      case actions.GET_ADMIN_USERS_FAILURE:
      case actions.DELETE_ADMIN_USER_SUCCESS:
      case actions.DELETE_ADMIN_USER_FAILURE:
      case actions.GET_ORDERS_LIST_BY_ADMIN_SUCCESS:
      case actions.GET_ORDERS_LIST_BY_ADMIN_FAILURE:
      case actions.GET_ORDER_BY_ADMIN_SUCCESS:
      case actions.GET_ORDER_BY_ADMIN_FAILURE:
      case actions.GET_ADMIN_USER_PROFILE_SUCCESS:
      case actions.GET_ADMIN_USER_PROFILE_FAILURE:
      case actions.GET_FIO_ACCOUNTS_PROFILES_SUCCESS:
      case actions.GET_FIO_ACCOUNTS_PROFILES_FAILURE:
        return false;
      default:
        return state;
    }
  },
  orderItem(state: OrderItem = null, action) {
    switch (action.type) {
      case actions.GET_ORDER_BY_ADMIN_SUCCESS:
        return action.data;
      case actions.GET_ORDER_BY_ADMIN_FAILURE:
        return null;
      default:
        return state;
    }
  },
  ordersList(state: OrderItem[] = [], action) {
    switch (action.type) {
      case actions.GET_ORDERS_LIST_BY_ADMIN_SUCCESS:
        return action.data.orders;
      case actions.GET_ORDERS_LIST_BY_ADMIN_FAILURE:
        return state;
      default:
        return state;
    }
  },
  ordersCount(state: number = 0, action) {
    switch (action.type) {
      case actions.GET_ORDERS_LIST_BY_ADMIN_SUCCESS:
        return action.data.maxCount;
      case actions.GET_ORDERS_LIST_BY_ADMIN_FAILURE:
        return state;
      default:
        return state;
    }
  },
  adminUsersList(state: AdminUser[] = [], action) {
    switch (action.type) {
      case actions.GET_ADMIN_USERS_SUCCESS:
        return action.data.users;
      case actions.GET_ADMIN_USERS_FAILURE:
        return state;
      case actions.DELETE_ADMIN_USER_SUCCESS:
        return state.filter(adminUser => adminUser.id !== action.adminUserId);
      default:
        return state;
    }
  },
  adminUserProfile(state: AdminUserProfile = null, action) {
    switch (action.type) {
      case actions.GET_ADMIN_USER_PROFILE_SUCCESS:
        return action.data;
      case actions.GET_ADMIN_USER_PROFILE_FAILURE:
        return null;
      default:
        return state;
    }
  },
  adminUsersCount(state: number = 0, action) {
    switch (action.type) {
      case actions.GET_ADMIN_USERS_SUCCESS:
        return action.data.maxCount;
      case actions.GET_ADMIN_USERS_FAILURE:
        return state;
      case actions.DELETE_ADMIN_USER_SUCCESS:
        return state - 1;
      default:
        return state;
    }
  },
  fioAccountsProfilesList(state: FioAccountProfile[] = [], action) {
    switch (action.type) {
      case actions.GET_FIO_ACCOUNTS_PROFILES_SUCCESS:
        return action.data.accounts;
      case actions.GET_FIO_ACCOUNTS_PROFILES_FAILURE:
        return state;
      default:
        return state;
    }
  },
  fioAccountsProfilesCount(state: number = 0, action) {
    switch (action.type) {
      case actions.GET_FIO_ACCOUNTS_PROFILES_SUCCESS:
        return action.data.maxCount;
      case actions.GET_FIO_ACCOUNTS_PROFILES_FAILURE:
        return state;
      default:
        return state;
    }
  },
});
