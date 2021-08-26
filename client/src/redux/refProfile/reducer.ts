import { combineReducers } from 'redux';
import * as actions from './actions';

import { RefProfile } from '../../types';

export default combineReducers({
  loading(state = false, action) {
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
        return null;
      case actions.GET_REF_PROFILE_SUCCESS:
        return action.data;
      default:
        return state;
    }
  },
  params(state: any = null, action) {
    switch (action.type) {
      case actions.SET_CONTAINED_PARAMS:
        return action.data;
      default:
        return state;
    }
  },
});
