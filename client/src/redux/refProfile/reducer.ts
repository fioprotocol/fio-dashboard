import { combineReducers } from 'redux';

import * as actions from './actions';

import { RefProfile } from '../../types';

export default combineReducers({
  loading(state: boolean = false, action) {
    switch (action.type) {
      case actions.GET_REF_PROFILE_REQUEST:
        return true;
      case actions.GET_REF_PROFILE_SUCCESS:
      case actions.GET_REF_PROFILE_FAILURE:
        return false;
      default:
        return state;
    }
  },
  data(state: RefProfile | null = null, action) {
    switch (action.type) {
      case actions.GET_REF_PROFILE_REQUEST:
      case actions.GET_REF_PROFILE_FAILURE:
      case actions.CLEAR_REF_PROFILE:
        return null;
      case actions.GET_REF_PROFILE_SUCCESS:
        return action.data;
      case actions.GET_REF_PROFILE_SETTINGS_SUCCESS:
        return { ...state, settings: action.data };
      default:
        return state;
    }
  },
  refLinkError(state: string | null = null, action) {
    switch (action.type) {
      case actions.GET_REF_PROFILE_FAILURE:
        return 'Referral link is invalid';
      default:
        return state;
    }
  },
});
