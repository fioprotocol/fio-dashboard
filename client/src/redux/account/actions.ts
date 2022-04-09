import { Api } from '../../api';
import { FioWalletDoublet, NewFioWalletDoublet } from '../../types';
import { CommonAction, CommonPromiseAction } from '../types';

export const prefix = 'account';

export const SET_WALLETS_REQUEST = `${prefix}/SET_WALLETS_REQUEST`;
export const SET_WALLETS_SUCCESS = `${prefix}/SET_WALLETS_SUCCESS`;
export const SET_WALLETS_FAILURE = `${prefix}/SET_WALLETS_FAILURE`;

export const setWallets = (
  fioWallets: FioWalletDoublet[],
): CommonPromiseAction => ({
  types: [SET_WALLETS_REQUEST, SET_WALLETS_SUCCESS, SET_WALLETS_FAILURE],
  promise: (api: Api) => api.account.setWallets(fioWallets),
});

export const ADD_WALLET_REQUEST = `${prefix}/ADD_WALLET_REQUEST`;
export const ADD_WALLET_SUCCESS = `${prefix}/ADD_WALLET_SUCCESS`;
export const ADD_WALLET_FAILURE = `${prefix}/ADD_WALLET_FAILURE`;

export const addWallet = ({
  name,
  publicKey,
  edgeId,
  from,
  data,
}: NewFioWalletDoublet): CommonPromiseAction => ({
  types: [ADD_WALLET_REQUEST, ADD_WALLET_SUCCESS, ADD_WALLET_FAILURE],
  promise: (api: Api) =>
    api.account.addWallet({
      name,
      publicKey,
      edgeId,
      from,
      data,
    }),
});

export const UPDATE_WALLET_NAME = `${prefix}/UPDATE_WALLET_NAME`;

export const updateWalletName = ({
  name,
  publicKey,
}: {
  name: string;
  publicKey: string;
}): CommonAction => ({
  type: UPDATE_WALLET_NAME,
  data: {
    name,
    publicKey,
  },
});
