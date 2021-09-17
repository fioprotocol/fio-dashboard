import { combineReducers } from 'redux';
import * as actions from './actions';

export default combineReducers({
  hasRedirect(state: string = '', action) {
    switch (action.type) {
      case actions.SET_REDIRECT_PATH:
        return action.data;
      default:
        return state;
    }
  },
});
