import { EdgeAccount } from 'edge-core-js';
import { WalletKeys } from '../types';

export const getWalletKeys = async (
  account: EdgeAccount,
): Promise<{ [key: string]: WalletKeys }> => {
  const keys: { [key: string]: WalletKeys } = {};
  try {
    for (const walletId of account.activeWalletIds) {
      const wallet = await account.waitForCurrencyWallet(walletId);
      if (wallet.currencyInfo.currencyCode === 'FIO') {
        keys[walletId] = {
          private: wallet.keys.fioKey,
          public: wallet.publicWalletInfo.keys.publicKey,
        };
        await wallet.stopEngine();
      }
    }
  } catch (e) {
    console.error(e);
  }

  return keys;
};
