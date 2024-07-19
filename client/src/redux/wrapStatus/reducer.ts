import { combineReducers } from 'redux';

import * as actions from './actions';

import { WrapStatusWrapItem } from '../../types';

export default combineReducers({
  loading(state: boolean = false, action) {
    switch (action.type) {
      case actions.GET_WRAP_TOKENS_LIST_REQUEST:
      case actions.GET_UNWRAP_TOKENS_LIST_REQUEST:
      case actions.GET_UNWRAP_DOMAINS_LIST_REQUEST:
      case actions.GET_WRAP_DOMAINS_LIST_REQUEST:
      case actions.GET_BURNED_DOMAINS_LIST_REQUEST:
        return true;
      case actions.GET_WRAP_TOKENS_LIST_SUCCESS:
      case actions.GET_WRAP_TOKENS_LIST_FAILURE:
      case actions.GET_UNWRAP_TOKENS_LIST_SUCCESS:
      case actions.GET_UNWRAP_TOKENS_LIST_FAILURE:
      case actions.GET_UNWRAP_DOMAINS_LIST_SUCCESS:
      case actions.GET_UNWRAP_DOMAINS_LIST_FAILURE:
      case actions.GET_WRAP_DOMAINS_LIST_SUCCESS:
      case actions.GET_WRAP_DOMAINS_LIST_FAILURE:
      case actions.GET_BURNED_DOMAINS_LIST_SUCCESS:
      case actions.GET_BURNED_DOMAINS_LIST_FAILURE:
        return false;
      default:
        return state;
    }
  },
  wrapTokensList(state: WrapStatusWrapItem[] = [], action) {
    switch (action.type) {
      case actions.GET_WRAP_TOKENS_LIST_SUCCESS:
        return action.data.list;
      case actions.GET_WRAP_TOKENS_LIST_FAILURE:
        return state;
      default:
        return state;
    }
  },
  wrapTokensListCount(state: number = 0, action) {
    switch (action.type) {
      case actions.GET_WRAP_TOKENS_LIST_SUCCESS:
        return action.data.maxCount;
      case actions.GET_WRAP_TOKENS_LIST_FAILURE:
        return state;
      default:
        return state;
    }
  },
  unwrapTokensList(state: WrapStatusWrapItem[] = [], action) {
    switch (action.type) {
      case actions.GET_UNWRAP_TOKENS_LIST_SUCCESS:
        return action.data.list;
      case actions.GET_UNWRAP_TOKENS_LIST_FAILURE:
        return state;
      default:
        return state;
    }
  },
  burnedDomainsList(state: WrapStatusWrapItem[] = [], action) {
    switch (action.type) {
      case actions.GET_BURNED_DOMAINS_LIST_SUCCESS:
        return action.data.list;
      case actions.GET_BURNED_DOMAINS_LIST_FAILURE:
        return state;
      default:
        return state;
    }
  },
  unwrapTokensListCount(state: number = 0, action) {
    switch (action.type) {
      case actions.GET_UNWRAP_TOKENS_LIST_SUCCESS:
        return action.data.maxCount;
      case actions.GET_UNWRAP_TOKENS_LIST_FAILURE:
        return state;
      default:
        return state;
    }
  },
  unwrapDomainsList(state: WrapStatusWrapItem[] = [], action) {
    switch (action.type) {
      case actions.GET_UNWRAP_DOMAINS_LIST_SUCCESS:
        return action.data.list;
      case actions.GET_UNWRAP_DOMAINS_LIST_FAILURE:
        return state;
      default:
        return state;
    }
  },
  unwrapDomainsListCount(state: number = 0, action) {
    switch (action.type) {
      case actions.GET_UNWRAP_DOMAINS_LIST_SUCCESS:
        return action.data.maxCount;
      case actions.GET_UNWRAP_DOMAINS_LIST_FAILURE:
        return state;
      default:
        return state;
    }
  },
  wrapDomainsList(state: WrapStatusWrapItem[] = [], action) {
    switch (action.type) {
      case actions.GET_WRAP_DOMAINS_LIST_SUCCESS:
        return action.data.list;
      case actions.GET_WRAP_DOMAINS_LIST_FAILURE:
        return state;
      default:
        return state;
    }
  },
  wrapDomainsListCount(state: number = 0, action) {
    switch (action.type) {
      case actions.GET_WRAP_DOMAINS_LIST_SUCCESS:
        return action.data.maxCount;
      case actions.GET_WRAP_DOMAINS_LIST_FAILURE:
        return state;
      default:
        return state;
    }
  },
  burnedDomainsListCount(state: number = 0, action) {
    switch (action.type) {
      case actions.GET_BURNED_DOMAINS_LIST_SUCCESS:
        return action.data.maxCount;
      case actions.GET_BURNED_DOMAINS_LIST_FAILURE:
        return state;
      default:
        return state;
    }
  },
});
