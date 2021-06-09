export const prefix = 'fio';

export const REFRESH_BALANCE_REQUEST = `${prefix}/REFRESH_BALANCE_REQUEST`;
export const REFRESH_BALANCE_SUCCESS = `${prefix}/REFRESH_BALANCE_SUCCESS`;
export const REFRESH_BALANCE_FAILURE = `${prefix}/REFRESH_BALANCE_FAILURE`;

export const refreshBalance = publicKey => ({
  types: [
    REFRESH_BALANCE_REQUEST,
    REFRESH_BALANCE_SUCCESS,
    REFRESH_BALANCE_FAILURE,
  ],
  promise: api => api.fio.getBalance(publicKey),
  publicKey,
});

export const REFRESH_FIO_NAMES_REQUEST = `${prefix}/REFRESH_FIO_NAMES_REQUEST`;
export const REFRESH_FIO_NAMES_SUCCESS = `${prefix}/REFRESH_FIO_NAMES_SUCCESS`;
export const REFRESH_FIO_NAMES_FAILURE = `${prefix}/REFRESH_FIO_NAMES_FAILURE`;

export const refreshFioNames = publicKey => ({
  types: [
    REFRESH_FIO_NAMES_REQUEST,
    REFRESH_FIO_NAMES_SUCCESS,
    REFRESH_FIO_NAMES_FAILURE,
  ],
  promise: api => api.fio.getFioNames(publicKey),
  publicKey,
});
