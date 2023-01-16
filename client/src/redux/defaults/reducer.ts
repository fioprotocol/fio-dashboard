import { combineReducers } from 'redux';

import * as actions from './actions';

import { AdminDomain } from '../../api/responses';

export default combineReducers({
  loading(state: boolean = false, action) {
    switch (action.type) {
      case actions.GET_AVAILABLE_DOMAINS_REQUEST:
        return true;
      case actions.GET_AVAILABLE_DOMAINS_SUCCESS:
      case actions.GET_AVAILABLE_DOMAINS_FAILURE:
        return false;
      default:
        return state;
    }
  },
  availableDomains(state: AdminDomain[] = [], action) {
    switch (action.type) {
      case actions.GET_AVAILABLE_DOMAINS_SUCCESS:
        return action.data;
      default:
        return state;
    }
  },
});
