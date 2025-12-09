import { Api } from '../../api';

import { CommonPromiseAction } from '../types';

export const prefix = 'wrapStatus';

// Filters type for wrap status requests
type WrapStatusFilters = {
  createdAt?: string | null;
  dateRange?: { startDate: number; endDate: number } | null;
  chain?: string | null;
};

// Helper to build params with non-null filters only
const buildParams = (
  limit: number,
  offset: number,
  filters?: WrapStatusFilters,
) => {
  const params: {
    limit: number;
    offset: number;
    chain?: string;
    filters?: {
      createdAt?: string;
      dateRange?: { startDate: number; endDate: number };
    };
  } = { limit, offset };

  // Add chain if provided
  if (filters?.chain) {
    params.chain = filters.chain;
  }

  // Add date filters if provided
  if (filters?.createdAt || filters?.dateRange) {
    params.filters = {};
    if (filters.createdAt) {
      params.filters.createdAt = filters.createdAt;
    }
    if (filters.dateRange) {
      params.filters.dateRange = filters.dateRange;
    }
  }

  return params;
};

export const GET_WRAP_TOKENS_LIST_REQUEST = `${prefix}/GET_WRAP_TOKENS_LIST_REQUEST`;
export const GET_WRAP_TOKENS_LIST_SUCCESS = `${prefix}/GET_WRAP_TOKENS_LIST_SUCCESS`;
export const GET_WRAP_TOKENS_LIST_FAILURE = `${prefix}/GET_WRAP_TOKENS_LIST_FAILURE`;

export const getWrapTokensList = (
  limit = 25,
  offset = 0,
  filters?: WrapStatusFilters,
): CommonPromiseAction => ({
  types: [
    GET_WRAP_TOKENS_LIST_REQUEST,
    GET_WRAP_TOKENS_LIST_SUCCESS,
    GET_WRAP_TOKENS_LIST_FAILURE,
  ],
  promise: (api: Api) =>
    api.wrapStatus.wrapTokensList(buildParams(limit, offset, filters)),
});

export const GET_UNWRAP_TOKENS_LIST_REQUEST = `${prefix}/GET_UNWRAP_TOKENS_LIST_REQUEST`;
export const GET_UNWRAP_TOKENS_LIST_SUCCESS = `${prefix}/GET_UNWRAP_TOKENS_LIST_SUCCESS`;
export const GET_UNWRAP_TOKENS_LIST_FAILURE = `${prefix}/GET_UNWRAP_TOKENS_LIST_FAILURE`;

export const getUnwrapTokensList = (
  limit = 25,
  offset = 0,
  filters?: WrapStatusFilters,
): CommonPromiseAction => ({
  types: [
    GET_UNWRAP_TOKENS_LIST_REQUEST,
    GET_UNWRAP_TOKENS_LIST_SUCCESS,
    GET_UNWRAP_TOKENS_LIST_FAILURE,
  ],
  promise: (api: Api) =>
    api.wrapStatus.unwrapTokensList(buildParams(limit, offset, filters)),
});

export const GET_UNWRAP_DOMAINS_LIST_REQUEST = `${prefix}/GET_UNWRAP_DOMAINS_LIST_REQUEST`;
export const GET_UNWRAP_DOMAINS_LIST_SUCCESS = `${prefix}/GET_UNWRAP_DOMAINS_LIST_SUCCESS`;
export const GET_UNWRAP_DOMAINS_LIST_FAILURE = `${prefix}/GET_UNWRAP_DOMAINS_LIST_FAILURE`;

export const getUnwrapDomainsList = (
  limit = 25,
  offset = 0,
  filters?: WrapStatusFilters,
): CommonPromiseAction => ({
  types: [
    GET_UNWRAP_DOMAINS_LIST_REQUEST,
    GET_UNWRAP_DOMAINS_LIST_SUCCESS,
    GET_UNWRAP_DOMAINS_LIST_FAILURE,
  ],
  promise: (api: Api) =>
    api.wrapStatus.unwrapDomainsList(buildParams(limit, offset, filters)),
});

export const GET_WRAP_DOMAINS_LIST_REQUEST = `${prefix}/GET_WRAP_DOMAINS_LIST_REQUEST`;
export const GET_WRAP_DOMAINS_LIST_SUCCESS = `${prefix}/GET_WRAP_DOMAINS_LIST_SUCCESS`;
export const GET_WRAP_DOMAINS_LIST_FAILURE = `${prefix}/GET_WRAP_DOMAINS_LIST_FAILURE`;

export const getWrapDomainsList = (
  limit = 25,
  offset = 0,
  filters?: WrapStatusFilters,
): CommonPromiseAction => ({
  types: [
    GET_WRAP_DOMAINS_LIST_REQUEST,
    GET_WRAP_DOMAINS_LIST_SUCCESS,
    GET_WRAP_DOMAINS_LIST_FAILURE,
  ],
  promise: (api: Api) =>
    api.wrapStatus.wrapDomainsList(buildParams(limit, offset, filters)),
});

export const GET_BURNED_DOMAINS_LIST_REQUEST = `${prefix}/GET_BURNED_DOMAINS_LIST_REQUEST`;
export const GET_BURNED_DOMAINS_LIST_SUCCESS = `${prefix}/GET_BURNED_DOMAINS_LIST_SUCCESS`;
export const GET_BURNED_DOMAINS_LIST_FAILURE = `${prefix}/GET_BURNED_DOMAINS_LIST_FAILURE`;

export const getBurnedDomainsList = (
  limit = 25,
  offset = 0,
  filters?: WrapStatusFilters,
): CommonPromiseAction => ({
  types: [
    GET_BURNED_DOMAINS_LIST_REQUEST,
    GET_BURNED_DOMAINS_LIST_SUCCESS,
    GET_BURNED_DOMAINS_LIST_FAILURE,
  ],
  promise: (api: Api) =>
    api.wrapStatus.getBurnedDomainsList(buildParams(limit, offset, filters)),
});
