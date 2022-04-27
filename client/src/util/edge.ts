import { EdgeAccount } from 'edge-core-js';

import { sleep } from '../utils';
import { log } from './general';

import { EdgeWalletsKeys } from '../types';

export const waitWalletKeys = async (
  account: EdgeAccount,
): Promise<EdgeWalletsKeys> => {
  const keys: EdgeWalletsKeys = {};
  try {
    for (const walletId of account.activeWalletIds) {
      const wallet = await account.waitForCurrencyWallet(walletId);
      if (wallet.currencyInfo.currencyCode === 'FIO') {
        keys[walletId] = {
          private: wallet.keys.fioKey,
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
