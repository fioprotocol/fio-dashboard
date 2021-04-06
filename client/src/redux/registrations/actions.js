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
