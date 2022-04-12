import { combineReducers } from 'redux';

import * as actions from './actions';

import {
  CHANGE_RECOVERY_QUESTIONS_CLOSE,
  CHANGE_RECOVERY_QUESTIONS_OPEN,
} from '../edge/actions';
import { USER_STATUSES } from '../../constants/common';

import {
  User,
  LastAuthData,
  EmailConfirmationResult,
  AnyType,
} from '../../types';

export default combineReducers({
  loading(state: boolean = false, action) {
    switch (action.type) {
      case actions.PROFILE_REQUEST:
      case actions.NONCE_REQUEST:
      case actions.LOGIN_REQUEST:
      case actions.LOGOUT_REQUEST:
      case actions.SIGNUP_REQUEST:
      case actions.RESEND_CONFIRM_EMAIL_REQUEST:
      case actions.CONFIRM_EMAIL_REQUEST:
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
      case actions.RESEND_CONFIRM_EMAIL_SUCCESS:
      case actions.RESEND_CONFIRM_EMAIL_FAILURE:
      case actions.CONFIRM_EMAIL_SUCCESS:
      case actions.CONFIRM_EMAIL_FAILURE:
        return false;
      default:
        return state;
    }
  },
  updateEmailLoading(state: boolean = false, action) {
    switch (action.type) {
      case actions.UPDATE_EMAIL_REQ_REQUEST:
      case actions.UPDATE_EMAIL_REQUEST:
        return true;
      case actions.UPDATE_EMAIL_REQ_SUCCESS:
      case actions.UPDATE_EMAIL_REQ_FAILURE:
      case actions.UPDATE_EMAIL_SUCCESS:
      case actions.UPDATE_EMAIL_FAILURE:
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
        return false;
      default:
        return state;
    }
  },
  user(state: User | null = null, action) {
    switch (action.type) {
      case actions.PROFILE_SUCCESS:
        return action.data;
      case actions.SET_RECOVERY_SUCCESS:
        return { ...state, secretSet: true };
      case actions.LOGOUT_SUCCESS:
        return null;
      case actions.CONFIRM_EMAIL_SUCCESS: {
        if (state != null && state.email)
          return { ...state, status: USER_STATUSES.ACTIVE };

        return state;
      }
      case actions.UPDATE_EMAIL_REQ_SUCCESS: {
        if (state != null && state.status)
          return {
            ...state,
            status: USER_STATUSES.NEW_EMAIL_NOT_VERIFIED,
            newEmail: action.newEmail,
          };
        return state;
      }
      case actions.UPDATE_EMAIL_REVERT_SUCCESS: {
        if (state != null && state.status)
          return { ...state, status: USER_STATUSES.ACTIVE, newEmail: '' };
        return state;
      }
      case actions.UPDATE_STATE_EMAIL: {
        if (state != null && state.status)
          return {
            ...state,
            status: USER_STATUSES.ACTIVE,
            email: action.data.email,
            newEmail: '',
          };
        return state;
      }
      case actions.AUTH_CHECK_SUCCESS: {
        if (
          !!action.data.id &&
          state != null &&
          state.email &&
          state.status === USER_STATUSES.NEW
        )
          return { ...state, status: action.data.status };

        // redirects user to settings after updated email
        if (
          !!action.data.id &&
          state != null &&
          state.id === action.data.id &&
          state.email &&
          state.email !== action.data.email &&
          state.status === USER_STATUSES.NEW_EMAIL_NOT_VERIFIED
        )
          return {
            ...state,
            status: action.data.status,
            email: action.data.email,
            newEmail: '',
          };

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
      default:
        return state;
    }
  },
  emailConfirmationResult(state: EmailConfirmationResult = {}, action) {
    switch (action.type) {
      case actions.CONFIRM_EMAIL_SUCCESS:
      case actions.UPDATE_EMAIL_SUCCESS:
        return { success: true, ...action.data };
      case actions.CONFIRM_EMAIL_FAILURE:
      case actions.UPDATE_EMAIL_FAILURE:
        return { success: false, error: action.error.code };
      case actions.RESET_EMAIL_CONFIRMATION_RESULT:
        return {};
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
        return action.error;
      default:
        return state;
    }
  },
  successfullyRegistered(state: boolean = false, action) {
    switch (action.type) {
      case actions.SIGNUP_SUCCESS:
        return true;
      case actions.RESET_SUCCESS_STATE:
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
  emailConfirmationToken(state: string | null = null, action) {
    switch (action.type) {
      case actions.LOGIN_SUCCESS:
        return action.data.emailConfirmationToken || null;
      case actions.CONFIRM_EMAIL_SUCCESS:
      case actions.LOGOUT_SUCCESS:
        return null;
      default:
        return state;
    }
  },
  emailConfirmationSent(state: boolean = false, action) {
    switch (action.type) {
      case actions.RESEND_CONFIRM_EMAIL_REQUEST:
      case actions.LOGOUT_SUCCESS:
        return false;
      case actions.RESEND_CONFIRM_EMAIL_SUCCESS:
        return true;
      default:
        return state;
    }
  },
});
