import { combineReducers } from 'redux';
import * as actions from './actions';
import { routerReducer } from 'react-router-redux';

export default combineReducers({
  hasRedirect(state = '', action) {
    switch (action.type) {
      case actions.SET_REDIRECT_PATH:
        return action.data;
      default:
        return state;
    }
  },
  route: routerReducer,
});
