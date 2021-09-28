import { combineReducers } from 'redux';
import * as actions from './actions';
import { SHOW_LOGIN } from '../modal/actions';

export default combineReducers({
  hasRedirect(state: string = '', action) {
    switch (action.type) {
      case actions.SET_REDIRECT_PATH:
      case SHOW_LOGIN:
        return action.data;
      default:
        return state;
    }
  },
});
