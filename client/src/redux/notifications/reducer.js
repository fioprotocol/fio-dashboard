import { combineReducers } from 'redux';
import * as actions from './actions';

export default combineReducers({
  loading(state = false, action) {
    switch (action.type) {
      case actions.LIST_REQUEST:
        return true;
      case actions.LIST_SUCCESS:
      case actions.LIST_FAILURE:
        return false;
      default:
        return state;
    }
  },
  list(state = [], action) {
    switch (action.type) {
      case actions.LIST_SUCCESS:
        return action.data;
      case actions.UPDATE_SUCCESS:
        return state.map(notification =>
          notification.id === action.id ? action.data : notification,
        );
      case actions.CREATE_SUCCESS:
        return [...state, action.data];
      default:
        return state;
    }
  },
});
