import { combineReducers } from 'redux';
import * as actions from './actions';
import { SHOW_LOGIN } from '../modal/actions';

export default combineReducers({
  redirectLink(state: string = '', action) {
    switch (action.type) {
      case actions.SET_REDIRECT_PATH:
        return action.data;
      case SHOW_LOGIN:
        return action.data || state;
      default:
        return state;
    }
  },
});
