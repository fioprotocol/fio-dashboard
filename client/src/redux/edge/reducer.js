import { combineReducers } from 'redux';
import * as actions from './actions';

export default combineReducers({
  loading(state = false, action) {
    switch (action.type) {
      case actions.LOGIN_REQUEST:
      case actions.LOGOUT_REQUEST:
      case actions.SIGNUP_REQUEST:
        return true;
      case actions.LOGIN_SUCCESS:
      case actions.LOGIN_FAILURE:
      case actions.LOGOUT_SUCCESS:
      case actions.LOGOUT_FAILURE:
      case actions.SIGNUP_SUCCESS:
      case actions.SIGNUP_FAILURE:
        return false;
      default:
        return state;
    }
  },
  account(state = null, action) {
    switch (action.type) {
      case actions.LOGIN_SUCCESS: {
        console.log(action.data);
        const account = action.data
        try {
          // Find the app wallet, or create one if necessary:
          const walletInfo = account.getFirstWalletInfo('wallet:fio')
          // const wallet =
          //   walletInfo == null
          //     ? await account.createCurrencyWallet('wallet:fio')
          //     : await account.waitForCurrencyWallet(walletInfo.id)
        } catch (e) {
          console.error(e)
        }
        return account;
      }
      case actions.LOGOUT_SUCCESS:
        return null;
      default:
        return state;
    }
  },
  loginSuccess(state = false, action) {
    switch (action.type) {
      case actions.LOGIN_SUCCESS: {
        return true;
      }
      case actions.LOGIN_REQUEST:
        return false;
      default:
        return state;
    }
  },
  edgeContextSet(state = false, action) {
    switch (action.type) {
      case actions.EDGE_CONTEXT_INIT_SUCCESS: {
        return true;
      }
      default:
        return state;
    }
  },
  cachedUsers(state = [], action) {
    switch (action.type) {
      case actions.CACHED_USERS_REQUEST: {
        return [];
      }
      case actions.CACHED_USERS_SUCCESS: {
        return action.data;
      }
      default:
        return state;
    }
  },
  recoveryQuestions(state = [], action) {
    switch (action.type) {
      case actions.RECOVERY_QUEST_REQUEST: {
        return [];
      }
      case actions.RECOVERY_QUEST_SUCCESS: {
        return action.data;
      }
      default:
        return state;
    }
  },
  usernameIsAvailable(state = false, action) {
    switch (action.type) {
      case actions.USERNAME_AVAIL_SUCCESS: {
        return action.data;
      }
      case actions.USERNAME_AVAIL_REQUEST: {
        return false;
      }
      default:
        return state;
    }
  },
  usernameAvailableLoading(state = false, action) {
    switch (action.type) {
      case actions.USERNAME_AVAIL_FAILURE:
      case actions.USERNAME_AVAIL_SUCCESS: {
        return false;
      }
      case actions.USERNAME_AVAIL_REQUEST: {
        return true;
      }
      default:
        return state;
    }
  },
});
