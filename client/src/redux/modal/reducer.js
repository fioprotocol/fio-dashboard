import { combineReducers } from 'redux';
import * as actions from './actions';
import { PROFILE_SUCCESS } from '../profile/actions';

export default combineReducers({
  showLogin(state = false, action) {
    switch (action.type) {
      case actions.SHOW_LOGIN:
        return true;
      case actions.CLOSE_LOGIN:
        return false;
      default:
        return state;
    }
  },
  showRecovery(state = false, action) {
    switch (action.type) {
      case actions.SHOW_RECOVERY_PASSWORD:
        return true;
      case actions.CLOSE_RECOVERY_PASSWORD:
        return false;
      case PROFILE_SUCCESS:
        return !action.data.secretSet && !action.data.secretSetNotification;
      default:
        return state;
    }
  },
});
