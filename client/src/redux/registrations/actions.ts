import { Api } from '../../api';
import { CommonAction, CommonPromiseAction } from '../types';

export const prefix = 'registrations';

export const PRICES_REQUEST = `${prefix}/PRICES_REQUEST`;
export const PRICES_SUCCESS = `${prefix}/PRICES_SUCCESS`;
export const PRICES_FAILURE = `${prefix}/PRICES_FAILURE`;

export const getPrices = (): CommonPromiseAction => ({
  types: [PRICES_REQUEST, PRICES_SUCCESS, PRICES_FAILURE],
  promise: (api: Api) => api.fioReg.prices(),
});

export const DOMAINS_REQUEST = `${prefix}/DOMAINS_REQUEST`;
export const DOMAINS_SUCCESS = `${prefix}/DOMAINS_SUCCESS`;
export const DOMAINS_FAILURE = `${prefix}/DOMAINS_FAILURE`;

export const getDomains = (): CommonPromiseAction => ({
  types: [DOMAINS_REQUEST, DOMAINS_SUCCESS, DOMAINS_FAILURE],
  promise: (api: Api) => api.registration.domainsList(),
});

export const SET_PROCESSING = `${prefix}/SET_PROCESSING`;

export const setProcessing = (isProcessing: boolean): CommonAction => ({
  type: SET_PROCESSING,
  data: isProcessing,
});

export const PURCHASE_RESULTS_CLOSE = `${prefix}/PURCHASE_RESULTS_CLOSE`;

export const onPurchaseResultsClose = (): CommonAction => ({
  type: PURCHASE_RESULTS_CLOSE,
});

export const API_URLS_REQUEST = `${prefix}/API_URLS_REQUEST`;
export const API_URLS_SUCCESS = `${prefix}/API_URLS_SUCCESS`;
export const API_URLS_FAILURE = `${prefix}/API_URLS_FAILURE`;

export const getApiUrls = (): CommonPromiseAction => ({
  types: [API_URLS_REQUEST, API_URLS_SUCCESS, API_URLS_FAILURE],
  promise: (api: Api) => api.fioReg.apiUrls(),
});
