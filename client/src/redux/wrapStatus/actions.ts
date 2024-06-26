import { Api } from '../../api';

import { CommonPromiseAction } from '../types';

export const prefix = 'wrapStatus';

export const GET_WRAP_TOKENS_LIST_REQUEST = `${prefix}/GET_WRAP_TOKENS_LIST_REQUEST`;
export const GET_WRAP_TOKENS_LIST_SUCCESS = `${prefix}/GET_WRAP_TOKENS_LIST_SUCCESS`;
export const GET_WRAP_TOKENS_LIST_FAILURE = `${prefix}/GET_WRAP_TOKENS_LIST_FAILURE`;

export const getWrapTokensList = (
  limit = 25,
  offset = 0,
): CommonPromiseAction => ({
  types: [
    GET_WRAP_TOKENS_LIST_REQUEST,
    GET_WRAP_TOKENS_LIST_SUCCESS,
    GET_WRAP_TOKENS_LIST_FAILURE,
  ],
  promise: (api: Api) => api.wrapStatus.wrapTokensList({ limit, offset }),
});

export const GET_UNWRAP_TOKENS_LIST_REQUEST = `${prefix}/GET_UNWRAP_TOKENS_LIST_REQUEST`;
export const GET_UNWRAP_TOKENS_LIST_SUCCESS = `${prefix}/GET_UNWRAP_TOKENS_LIST_SUCCESS`;
export const GET_UNWRAP_TOKENS_LIST_FAILURE = `${prefix}/GET_UNWRAP_TOKENS_LIST_FAILURE`;

export const getUnwrapTokensList = (
  limit = 25,
  offset = 0,
): CommonPromiseAction => ({
  types: [
    GET_UNWRAP_TOKENS_LIST_REQUEST,
    GET_UNWRAP_TOKENS_LIST_SUCCESS,
    GET_UNWRAP_TOKENS_LIST_FAILURE,
  ],
  promise: (api: Api) => api.wrapStatus.unwrapTokensList({ limit, offset }),
});

export const GET_UNWRAP_DOMAINS_LIST_REQUEST = `${prefix}/GET_UNWRAP_DOMAINS_LIST_REQUEST`;
export const GET_UNWRAP_DOMAINS_LIST_SUCCESS = `${prefix}/GET_UNWRAP_DOMAINS_LIST_SUCCESS`;
export const GET_UNWRAP_DOMAINS_LIST_FAILURE = `${prefix}/GET_UNWRAP_DOMAINS_LIST_FAILURE`;

export const getUnwrapDomainsList = (
  limit = 25,
  offset = 0,
): CommonPromiseAction => ({
  types: [
    GET_UNWRAP_DOMAINS_LIST_REQUEST,
    GET_UNWRAP_DOMAINS_LIST_SUCCESS,
    GET_UNWRAP_DOMAINS_LIST_FAILURE,
  ],
  promise: (api: Api) => api.wrapStatus.unwrapDomainsList({ limit, offset }),
});

export const GET_WRAP_DOMAINS_LIST_REQUEST = `${prefix}/GET_WRAP_DOMAINS_LIST_REQUEST`;
export const GET_WRAP_DOMAINS_LIST_SUCCESS = `${prefix}/GET_WRAP_DOMAINS_LIST_SUCCESS`;
export const GET_WRAP_DOMAINS_LIST_FAILURE = `${prefix}/GET_WRAP_DOMAINS_LIST_FAILURE`;

export const getWrapDomainsList = (
  limit = 25,
  offset = 0,
): CommonPromiseAction => ({
  types: [
    GET_WRAP_DOMAINS_LIST_REQUEST,
    GET_WRAP_DOMAINS_LIST_SUCCESS,
    GET_WRAP_DOMAINS_LIST_FAILURE,
  ],
  promise: (api: Api) => api.wrapStatus.wrapDomainsList({ limit, offset }),
});

export const GET_BURNED_DOMAINS_LIST_REQUEST = `${prefix}/GET_BURNED_DOMAINS_LIST_REQUEST`;
export const GET_BURNED_DOMAINS_LIST_SUCCESS = `${prefix}/GET_BURNED_DOMAINS_LIST_SUCCESS`;
export const GET_BURNED_DOMAINS_LIST_FAILURE = `${prefix}/GET_BURNED_DOMAINS_LIST_FAILURE`;

export const getBurnedDomainsList = (
  limit = 25,
  offset = 0,
): CommonPromiseAction => ({
  types: [
    GET_BURNED_DOMAINS_LIST_REQUEST,
    GET_BURNED_DOMAINS_LIST_SUCCESS,
    GET_BURNED_DOMAINS_LIST_FAILURE,
  ],
  promise: (api: Api) => api.wrapStatus.getBurnedDomainsList({ limit, offset }),
});
