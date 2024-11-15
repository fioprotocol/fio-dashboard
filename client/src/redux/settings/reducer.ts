import { combineReducers } from 'redux';

import * as actions from './actions';

import { SiteSetting } from '../../types/settings';

export default combineReducers({
  loading(state = false, action) {
    switch (action.type) {
      case actions.GET_SITE_SETTINGS_REQUEST:
        return true;
      case actions.GET_SITE_SETTINGS_SUCCESS:
      case actions.GET_SITE_SETTINGS_FAILURE:
        return false;
      default:
        return state;
    }
  },
  siteSettings(state: SiteSetting = {}, action) {
    switch (action.type) {
      case actions.GET_SITE_SETTINGS_SUCCESS:
        return action.data;
      default:
        return state;
    }
  },
});
