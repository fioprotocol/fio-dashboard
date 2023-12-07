import {
  EdgeAccount,
  PasswordError,
  UsernameError,
  NetworkError,
} from 'edge-core-js';

import { sleep } from '../utils';
import { log } from './general';

import { EdgeWalletsKeys } from '../types';

const PASSWORD_ERROR = new PasswordError('').name;
const USERNAME_ERROR = new UsernameError('').name;
const NETWORK_ERROR = new NetworkError('').name;

export const waitWalletKeys = async (
  account: EdgeAccount,
): Promise<EdgeWalletsKeys> => {
  const keys: EdgeWalletsKeys = {};
  try {
    for (const walletId of account.activeWalletIds) {
      const wallet = await account.waitForCurrencyWallet(walletId);
      const privateKey = await account.getDisplayPrivateKey(walletId);
      if (wallet.currencyInfo.currencyCode === 'FIO') {
        keys[walletId] = {
          private: privateKey,
          public: wallet.publicWalletInfo.keys.publicKey,
        };
        // todo: there is no stopEngine anymore, do something instead of 'await wallet.stopEngine()';
      }
    }
  } catch (e) {
    log.error(e);
  }

  return keys;
};

export const waitForEdgeAccountStop = async (
  edgeAccount?: EdgeAccount,
): Promise<void> => {
  try {
    edgeAccount?.loggedIn && (await edgeAccount.logout());
    await sleep(3000); // todo: added for testnet env because edge fio plugin rewriting base url after pin confirmation. Need to figure out how to be sure that fio engine is killed or fix transaction global base url const in FIOSDK
  } catch (e) {
    //
  }
};

export const isEdgeAuthenticationError = (edgeLoginFailure: {
  name?: string;
  type?: string;
}): boolean => {
  const type = edgeLoginFailure.type || edgeLoginFailure.name;

  return type === PASSWORD_ERROR || type === USERNAME_ERROR;
};
export const isEdgeNetworkError = (edgeLoginFailure: {
  name?: string;
  type?: string;
}): boolean => {
  const type = edgeLoginFailure.type || edgeLoginFailure.name;

  return type === NETWORK_ERROR;
};
