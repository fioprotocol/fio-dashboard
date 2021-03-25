import { combineReducers } from 'redux';
import * as actions from './actions';

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
});
