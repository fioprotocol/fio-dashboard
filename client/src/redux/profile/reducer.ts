import { combineReducers } from 'redux';

import * as actions from './actions';

import {
  CHANGE_RECOVERY_QUESTIONS_CLOSE,
  CHANGE_RECOVERY_QUESTIONS_OPEN,
} from '../edge/actions';

import { INTERNAL_SERVER_ERROR_CODE } from '../../constants/errors';

import { AdminUser, AnyType, LastAuthData, User } from '../../types';

export default combineReducers({
  loading(state: boolean = false, action) {
    switch (action.type) {
      case actions.PROFILE_REQUEST:
      case actions.NONCE_REQUEST:
      case actions.LOGIN_REQUEST:
      case actions.LOGOUT_REQUEST:
      case actions.ADMIN_LOGOUT_REQUEST:
      case actions.SIGNUP_REQUEST:
      case actions.ADMIN_LOGIN_REQUEST:
      case actions.ADMIN_PROFILE_REQUEST:
      case actions.ACTIVATE_AFFILIATE_REQUEST:
      case actions.UPDATE_AFFILIATE_REQUEST:
        return true;
      case actions.PROFILE_SUCCESS:
      case actions.PROFILE_FAILURE:
      case actions.LOGIN_SUCCESS:
      case actions.LOGIN_FAILURE:
      case actions.LOGOUT_SUCCESS:
      case actions.LOGOUT_FAILURE:
      case actions.SIGNUP_SUCCESS:
      case actions.SIGNUP_FAILURE:
      case actions.NONCE_SUCCESS:
      case actions.NONCE_FAILURE:
      case actions.ADMIN_LOGIN_SUCCESS:
      case actions.ADMIN_LOGIN_FAILURE:
      case actions.ADMIN_LOGOUT_SUCCESS:
      case actions.ADMIN_LOGOUT_FAILURE:
      case actions.ADMIN_PROFILE_SUCCESS:
      case actions.ADMIN_PROFILE_FAILURE:
      case actions.CONFIRM_ADMIN_EMAIL_SUCCESS:
      case actions.CONFIRM_ADMIN_EMAIL_FAILURE:
      case actions.ACTIVATE_AFFILIATE_SUCCESS:
      case actions.ACTIVATE_AFFILIATE_FAILURE:
      case actions.UPDATE_AFFILIATE_SUCCESS:
      case actions.UPDATE_AFFILIATE_FAILURE:
        return false;
      default:
        return state;
    }
  },
  tokenCheckResult(state: boolean | null = null, action) {
    switch (action.type) {
      case actions.AUTH_CHECK_REQUEST:
        return null;
      case actions.AUTH_CHECK_SUCCESS:
        return !!action.data.id;
      case actions.AUTH_CHECK_FAILURE:
        if (
          action.error &&
          action.error.status === INTERNAL_SERVER_ERROR_CODE
        ) {
          return action.error;
        }
        return false;
      default:
        return state;
    }
  },
  user(state: User | null = null, action) {
    switch (action.type) {
      case actions.PROFILE_SUCCESS:
      case actions.ACTIVATE_AFFILIATE_SUCCESS:
      case actions.UPDATE_AFFILIATE_SUCCESS:
        return action.data;
      case actions.SET_RECOVERY_SUCCESS:
        return { ...state, secretSet: true };
      case actions.LOGOUT_SUCCESS:
        return null;
      case actions.AUTH_CHECK_SUCCESS: {
        if (
          state != null &&
          !!action.data.newDeviceTwoFactor &&
          JSON.stringify(action.data.newDeviceTwoFactor) !==
            JSON.stringify(state.newDeviceTwoFactor)
        ) {
          return {
            ...state,
            newDeviceTwoFactor: action.data.newDeviceTwoFactor,
          };
        }

        return state;
      }
      case actions.GET_USERS_FREE_ADDRESSES_SUCCESS: {
        if (state != null) {
          return {
            ...state,
            freeAddresses: action.data,
          };
        }

        return state;
      }
      default:
        return state;
    }
  },
  adminUser(state: AdminUser | null = null, action) {
    switch (action.type) {
      case actions.ADMIN_PROFILE_SUCCESS:
        return action.data;
      case actions.ADMIN_LOGOUT_SUCCESS:
        return null;
      default:
        return state;
    }
  },
  error(
    state: {
      fields?: { [fieldName: string]: AnyType };
      code?: string;
      message?: string;
    } | null = null,
    action,
  ) {
    switch (action.type) {
      case actions.LOGIN_FAILURE:
      case actions.LOGOUT_FAILURE:
      case actions.SIGNUP_FAILURE:
        return action.error;
      case actions.RESET_ERROR:
        return null;
      default:
        return state;
    }
  },
  successfullyRegistered(state: boolean = false, action) {
    switch (action.type) {
      case actions.SIGNUP_SUCCESS:
        return true;
      case actions.RESET_SUCCESS_STATE:
      case actions.SIGNUP_FAILURE:
        return false;
      default:
        return state;
    }
  },
  lastAuthData(state: LastAuthData = null, action) {
    switch (action.type) {
      case actions.PROFILE_SUCCESS:
        return { email: action.data.email, username: action.data.username };
      case actions.RESET_LAST_AUTH_DATA_SUCCESS:
        return null;
      default:
        return state;
    }
  },
  profileRefreshed(state: boolean = false, action) {
    switch (action.type) {
      case actions.PROFILE_REQUEST:
        return false;
      case actions.PROFILE_SUCCESS:
      case actions.PROFILE_FAILURE:
        return true;
      default:
        return state;
    }
  },
  adminProfileRefreshed(state: boolean = false, action) {
    switch (action.type) {
      case actions.ADMIN_PROFILE_REQUEST:
        return false;
      case actions.ADMIN_PROFILE_SUCCESS:
      case actions.ADMIN_PROFILE_FAILURE:
        return true;
      default:
        return state;
    }
  },
  lastActivityDate(state: number = 0, action) {
    switch (action.type) {
      case actions.SECONDS_SINCE_LAST_ACTIVITY:
        return action.data;
      case actions.LOGOUT_SUCCESS:
        return 0;
      default:
        return state;
    }
  },
  changeRecoveryQuestionsResults(state: { status?: number } = {}, action) {
    switch (action.type) {
      case actions.SET_RECOVERY_SUCCESS: {
        return { status: 1 };
      }
      case actions.SET_RECOVERY_REQUEST:
      case actions.SET_RECOVERY_FAILURE:
      case CHANGE_RECOVERY_QUESTIONS_CLOSE:
      case CHANGE_RECOVERY_QUESTIONS_OPEN: {
        return {};
      }
      default:
        return state;
    }
  },
  isNewUser(state: boolean = false, action) {
    switch (action.type) {
      case actions.SET_IS_NEW_USER: {
        return action.isNewUser;
      }
      default:
        return state;
    }
  },
});
