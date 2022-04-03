import { combineReducers } from 'redux';

import * as actions from './actions';
import { CONFIRM_EMAIL_SUCCESS } from '../profile/actions';

import { REF_FLOW_STEPS } from '../../constants/common';

import { RefProfile, RefQueryParams } from '../../types';

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
        return null;
      case actions.GET_REF_PROFILE_SUCCESS:
        return action.data;
      default:
        return state;
    }
  },
  params(state: RefQueryParams | null = null, action) {
    switch (action.type) {
      case actions.SET_CONTAINED_PARAMS:
        return action.data;
      case CONFIRM_EMAIL_SUCCESS: {
        if (
          action.data.stateData != null &&
          action.data.stateData.refProfileQueryParams != null
        ) {
          return action.data.stateData.refProfileQueryParams;
        }
        return state;
      }
      default:
        return state;
    }
  },
  refLinkError(state: string | null = null, action) {
    switch (action.type) {
      case actions.GET_REF_PROFILE_FAILURE:
        return 'Referral link is invalid';
      case actions.SET_CONTAINED_PARAMS_ERROR:
        return action.data;
      default:
        return state;
    }
  },
  step(state: string = REF_FLOW_STEPS.INIT, action) {
    switch (action.type) {
      case actions.SET_STEP:
        return action.data;
      default:
        return state;
    }
  },
});
