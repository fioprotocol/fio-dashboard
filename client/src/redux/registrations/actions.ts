import { initCaptcha, verifyCaptcha } from '../../helpers/captcha';

import { Api } from '../../api';
import { RegistrationResult } from '../../types';
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
  promise: (api: Api) => api.fioReg.domains(),
});

export const CAPTCHA_REQUEST = `${prefix}/CAPTCHA_REQUEST`;
export const CAPTCHA_SUCCESS = `${prefix}/CAPTCHA_SUCCESS`;
export const CAPTCHA_FAILURE = `${prefix}/CAPTCHA_FAILURE`;

export const checkCaptcha = (): CommonPromiseAction => ({
  types: [CAPTCHA_REQUEST, CAPTCHA_SUCCESS, CAPTCHA_FAILURE],
  promise: async (api: Api) => {
    const data = await api.fioReg.initCaptcha();
    const captchaObj = await initCaptcha(data);
    return verifyCaptcha(captchaObj);
  },
});

export const SET_REGISTRATION_RESULTS = `${prefix}/SET_REGISTRATION_RESULTS`;

export const setRegistration = (results: RegistrationResult): CommonAction => ({
  type: SET_REGISTRATION_RESULTS,
  data: results,
});

export const SET_PROCESSING = `${prefix}/SET_PROCESSING`;

export const setProcessing = (isProcessing: boolean): CommonAction => ({
  type: SET_PROCESSING,
  data: isProcessing,
});
