export const prefix = 'account';

export const SET_WALLETS_REQUEST = `${prefix}/SET_WALLETS_REQUEST`;
export const SET_WALLETS_SUCCESS = `${prefix}/SET_WALLETS_SUCCESS`;
export const SET_WALLETS_FAILURE = `${prefix}/SET_WALLETS_FAILURE`;

export const setWallets = fioWallets => ({
  types: [SET_WALLETS_REQUEST, SET_WALLETS_SUCCESS, SET_WALLETS_FAILURE],
  promise: api => api.account.setWallets(fioWallets),
});

export const ADD_WALLET_REQUEST = `${prefix}/ADD_WALLET_REQUEST`;
export const ADD_WALLET_SUCCESS = `${prefix}/ADD_WALLET_SUCCESS`;
export const ADD_WALLET_FAILURE = `${prefix}/ADD_WALLET_FAILURE`;

export const addWallet = ({ name, publicKey, edgeId, from, data }) => ({
  types: [ADD_WALLET_REQUEST, ADD_WALLET_SUCCESS, ADD_WALLET_FAILURE],
  promise: api =>
    api.account.addWallet({
      name,
      publicKey,
      edgeId,
      from,
      data,
    }),
});
