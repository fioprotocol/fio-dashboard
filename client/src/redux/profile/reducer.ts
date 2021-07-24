import { combineReducers } from 'redux';
import * as actions from './actions';
import { FioWalletDoublet, LastAuthData } from '../../types';

type User = {
  email: string;
  username: string;
  fioWallets: FioWalletDoublet[];
  freeAddresses: { name: string }[];
  id: string;
  role: string;
  secretSetNotification: boolean;
  status: string;
  secretSet?: boolean;
};

export default combineReducers({
  loading(state: boolean = false, action) {
    switch (action.type) {
      case actions.PROFILE_REQUEST:
      case actions.NONCE_REQUEST:
      case actions.LOGIN_REQUEST:
      case actions.LOGOUT_REQUEST:
      case actions.SIGNUP_REQUEST:
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
      default:
        return state;
    }
  },
  isConfirmed(state: boolean = false, action) {
    switch (action.type) {
      case actions.CONFIRM_SUCCESS:
        return true;
      default:
        return state;
    }
  },
  isChangedPwd(state: boolean = false, action) {
    switch (action.type) {
      case actions.RESET_PASSWORD_REQUEST:
      case actions.RESET_PASSWORD_FAILURE:
        return false;
      case actions.RESET_PASSWORD_SUCCESS:
        return true;
      default:
        return state;
    }
  },
  isRecoveryRequested(state: boolean = false, action) {
    switch (action.type) {
      case actions.PASSWORD_RECOVERY_REQUEST:
      case actions.PASSWORD_RECOVERY_FAILURE:
        return false;
      case actions.PASSWORD_RECOVERY_SUCCESS:
        return true;
      case actions.LOGOUT_SUCCESS:
        return false;
      default:
        return state;
    }
  },
  error(state: any | null = null, action) {
    switch (action.type) {
      case actions.LOGIN_FAILURE:
      case actions.LOGOUT_FAILURE:
      case actions.PASSWORD_RECOVERY_FAILURE:
      case actions.RESET_PASSWORD_FAILURE:
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
});
