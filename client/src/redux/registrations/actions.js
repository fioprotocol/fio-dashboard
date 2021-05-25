import { initCaptcha, verifyCaptcha } from '../../helpers/captcha';

export const prefix = 'registrations';

export const PRICES_REQUEST = `${prefix}/PRICES_REQUEST`;
export const PRICES_SUCCESS = `${prefix}/PRICES_SUCCESS`;
export const PRICES_FAILURE = `${prefix}/PRICES_FAILURE`;

export const getPrices = () => ({
  types: [PRICES_REQUEST, PRICES_SUCCESS, PRICES_FAILURE],
  promise: api => api.fioReg.prices(),
});

export const DOMAINS_REQUEST = `${prefix}/DOMAINS_REQUEST`;
export const DOMAINS_SUCCESS = `${prefix}/DOMAINS_SUCCESS`;
export const DOMAINS_FAILURE = `${prefix}/DOMAINS_FAILURE`;

export const getDomains = () => ({
  types: [DOMAINS_REQUEST, DOMAINS_SUCCESS, DOMAINS_FAILURE],
  promise: api => api.fioReg.domains(),
});

export const CAPTCHA_REQUEST = `${prefix}/CAPTCHA_REQUEST`;
export const CAPTCHA_SUCCESS = `${prefix}/CAPTCHA_SUCCESS`;
export const CAPTCHA_FAILURE = `${prefix}/CAPTCHA_FAILURE`;

export const checkCaptcha = () => ({
  types: [CAPTCHA_REQUEST, CAPTCHA_SUCCESS, CAPTCHA_FAILURE],
  promise: async api => {
    const data = await api.fioReg.initCaptcha();
    const captchaObj = await initCaptcha(data);
    return verifyCaptcha(captchaObj);
  },
});
