import { Api } from '../../api';

import { CommonPromiseAction } from '../types';

export const prefix = 'defaults';

export const GET_AVAILABLE_DOMAINS_REQUEST = `${prefix}/GET_AVAILABLE_DOMAINS_REQUEST`;
export const GET_AVAILABLE_DOMAINS_SUCCESS = `${prefix}/GET_AVAILABLE_DOMAINS_SUCCESS`;
export const GET_AVAILABLE_DOMAINS_FAILURE = `${prefix}/GET_AVAILABLE_DOMAINS_FAILURE`;

export const getAvailableDomains = (): CommonPromiseAction => ({
  types: [
    GET_AVAILABLE_DOMAINS_REQUEST,
    GET_AVAILABLE_DOMAINS_SUCCESS,
    GET_AVAILABLE_DOMAINS_FAILURE,
  ],
  promise: (api: Api) => api.defaults.getAvailableDomains(),
});
