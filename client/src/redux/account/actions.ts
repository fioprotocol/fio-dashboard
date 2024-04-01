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

export const RESET_ADD_WALLET_SUCCESS = `${prefix}/RESET_ADD_WALLET_SUCCESS`;

export const resetAddWalletSuccess = (): CommonAction => ({
  type: RESET_ADD_WALLET_SUCCESS,
});

export const UPDATE_WALLET_NAME = `${prefix}/UPDATE_WALLET_NAME`;
export const DELETE_WALLET = `${prefix}/DELETE_WALLET`;

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

export const deleteWallet = ({
  publicKey,
}: {
  publicKey: string;
}): CommonAction => ({
  type: DELETE_WALLET,
  data: {
    publicKey,
  },
});

export const TOGGLE_IS_WALLET_CREATED = `${prefix}/TOGGLE_IS_WALLET_CREATED`;

export const toggleIsWalletCreated = (isCreated: boolean): CommonAction => ({
  type: TOGGLE_IS_WALLET_CREATED,
  isCreated,
});
