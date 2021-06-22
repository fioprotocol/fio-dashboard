export const prefix = 'account';

export const SET_WALLETS_REQUEST = `${prefix}/SET_WALLETS_REQUEST`;
export const SET_WALLETS_SUCCESS = `${prefix}/SET_WALLETS_SUCCESS`;
export const SET_WALLETS_FAILURE = `${prefix}/SET_WALLETS_FAILURE`;

export const setWallets = fioWallets => ({
  types: [SET_WALLETS_REQUEST, SET_WALLETS_SUCCESS, SET_WALLETS_FAILURE],
  promise: api => api.account.setWallets(fioWallets),
});
