import { combineReducers } from 'redux';

import * as actions from './actions';

import {
  AdminSearchResult,
  AdminUser,
  AdminUserProfile,
  FioAccountProfile,
  OrderDetails,
  RefProfile,
  User,
  FioApiUrl,
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
      case actions.ADMIN_SEARCH_REQUEST:
      case actions.GET_PARTNERS_REQUEST:
      case actions.GET_REGULAR_USERS_REQUEST:
      case actions.GET_FIO_API_URLS_REQUEST:
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
      case actions.ADMIN_SEARCH_SUCCESS:
      case actions.ADMIN_SEARCH_FAILURE:
      case actions.GET_PARTNERS_SUCCESS:
      case actions.GET_PARTNERS_FAILURE:
      case actions.GET_REGULAR_USERS_SUCCESS:
      case actions.GET_REGULAR_USERS_FAILURE:
      case actions.GET_FIO_API_URLS_SUCCESS:
      case actions.GET_FIO_API_URLS_FAILURE:
        return false;
      default:
        return state;
    }
  },
  orderItem(state: OrderDetails = null, action) {
    switch (action.type) {
      case actions.GET_ORDER_BY_ADMIN_SUCCESS:
        return action.data;
      case actions.GET_ORDER_BY_ADMIN_FAILURE:
        return null;
      default:
        return state;
    }
  },
  ordersList(state: OrderDetails[] = [], action) {
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
  adminSearch(state: AdminSearchResult = null, action) {
    switch (action.type) {
      case actions.ADMIN_SEARCH_SUCCESS:
        return action.data;
      case actions.ADMIN_SEARCH_FAILURE:
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
  partnersList(state: RefProfile[] = [], action) {
    switch (action.type) {
      case actions.GET_PARTNERS_SUCCESS:
        return action.data.partners;
      case actions.GET_PARTNERS_FAILURE:
        return state;
      default:
        return state;
    }
  },
  regularUsersList(state: User[] = [], action) {
    switch (action.type) {
      case actions.GET_REGULAR_USERS_SUCCESS:
        return action.data.users;
      case actions.GET_REGULAR_USERS_FAILURE:
        return state;
      default:
        return state;
    }
  },
  usersCount(state: number = 0, action) {
    switch (action.type) {
      case actions.GET_REGULAR_USERS_SUCCESS:
        return action.data.maxCount;
      case actions.GET_REGULAR_USERS_FAILURE:
        return state;
      default:
        return state;
    }
  },
  fioApiUrlsList(state: FioApiUrl[] = [], action) {
    switch (action.type) {
      case actions.GET_FIO_API_URLS_SUCCESS:
        return action.data.apiUrls;
      default:
        return state;
    }
  },
  fioApiUrlsCount(state: number = 0, action) {
    switch (action.type) {
      case actions.GET_FIO_API_URLS_SUCCESS:
        return action.data.maxCount;
      default:
        return state;
    }
  },
});
