import { combineReducers } from 'redux';

import * as actions from './actions';
import { CONFIRM_EMAIL_SUCCESS } from '../profile/actions';

import { CONTAINED_FLOW_STEPS } from '../../constants/common';

import { ContainedFlowQueryParams } from '../../types';

export default combineReducers({
  params(state: ContainedFlowQueryParams | null = null, action) {
    switch (action.type) {
      case actions.SET_CONTAINED_PARAMS:
        return action.data;
      case CONFIRM_EMAIL_SUCCESS: {
        if (
          action.data.stateData != null &&
          action.data.stateData.containedFlowQueryParams != null
        ) {
          return action.data.stateData.containedFlowQueryParams;
        }
        return state;
      }
      default:
        return state;
    }
  },
  containedFlowLinkError(state: string | null = null, action) {
    switch (action.type) {
      case actions.SET_CONTAINED_PARAMS_ERROR:
        return action.data;
      default:
        return state;
    }
  },
  step(state: string = CONTAINED_FLOW_STEPS.INIT, action) {
    switch (action.type) {
      case actions.SET_STEP:
        return action.data;
      default:
        return state;
    }
  },
});
