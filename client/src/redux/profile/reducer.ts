import { combineReducers } from 'redux';
import * as actions from './actions';
import {
  CHANGE_RECOVERY_QUESTIONS_CLOSE,
  CHANGE_RECOVERY_QUESTIONS_OPEN,
} from '../edge/actions';
import { User, LastAuthData, EmailConfirmationStateData } from '../../types';
import { USER_STATUSES } from '../../constants/common';

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
      default:
        return state;
    }
  },
  emailConfirmationResult(
    state: {
      success?: boolean;
      error?: string;
      stateData?: EmailConfirmationStateData;
    } = {},
    action,
  ) {
    switch (action.type) {
      case actions.CONFIRM_EMAIL_SUCCESS:
        return { success: true, stateData: action.data.stateData };
      case actions.CONFIRM_EMAIL_FAILURE:
        return { success: false, error: action.error.code };
      case actions.LOGIN_SUCCESS:
      case actions.LOGOUT_SUCCESS:
        return {};
      default:
        return state;
    }
  },
  error(state: any | null = null, action) {
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
      case actions.RESET_LAST_AUTH_DATA:
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
  changeRecoveryQuestionsResults(state = {}, action) {
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
  resendRecoveryResults(state = {}, action) {
    switch (action.type) {
      case actions.RESEND_RECOVERY_SUCCESS: {
        return action.data;
      }
      case actions.RESEND_RECOVERY_REQUEST:
      case actions.RESEND_RECOVERY_FAILURE:
      case actions.CLEAR_RESEND_RECOVERY_RESULTS: {
        return {};
      }
      default:
        return state;
    }
  },
  resending(state = false, action) {
    switch (action.type) {
      case actions.RESEND_RECOVERY_REQUEST:
        return true;
      case actions.RESEND_RECOVERY_SUCCESS:
      case actions.RESEND_RECOVERY_FAILURE:
        return false;
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
