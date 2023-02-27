import { combineReducers } from 'redux';

import * as actions from './actions';

import { CONTAINED_FLOW_STEPS } from '../../constants/containedFlow';

import { ContainedFlowQueryParams } from '../../types';

export default combineReducers({
  params(state: ContainedFlowQueryParams | null = null, action) {
    switch (action.type) {
      case actions.SET_CONTAINED_PARAMS:
        return action.data;
      case actions.RESET_CONTAINED_PARAMS: {
        return null;
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
        return action.step;
      default:
        return state;
    }
  },
});
