import { combineReducers } from 'redux';

import * as actions from './actions';
import { SHOW_LOGIN } from '../modal/actions';
import { RedirectLinkData } from '../../types';

export default combineReducers({
  redirectLink(state: RedirectLinkData | null = null, action) {
    switch (action.type) {
      case actions.SET_REDIRECT_PATH:
        return action.data;
      case SHOW_LOGIN:
        return action.data ? { pathname: action.data } : state;
      default:
        return state;
    }
  },
});
