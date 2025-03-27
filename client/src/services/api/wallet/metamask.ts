import { MetaMaskInpageProvider } from '@metamask/providers';

import { signNonce } from '../../../util/snap';

import { WALLET_CREATED_FROM } from '../../../constants/common';
import {
  METAMASK_ERRORS_CODE,
  WALLET_API_PROVIDER_ERRORS_CODE,
} from '../../../constants/errors';

import { WalletApiProvider } from '../types';
import { Nonce } from '../../../types';

export interface MetaMaskWalletApiProvider extends WalletApiProvider {
  provider: MetaMaskInpageProvider | null;
  authenticate: (authParams: {
    provider: MetaMaskInpageProvider;
  }) => Promise<void>;
}

export const metaMaskWalletProvider: MetaMaskWalletApiProvider = {
  name: WALLET_CREATED_FROM.METAMASK,
  provider: null,
  authenticate: async ({ provider }) => {
    metaMaskWalletProvider.provider = provider;
  },
  generateSignatures: async (challenge: string): Promise<Nonce> => {
    try {
      const signature = await signNonce(metaMaskWalletProvider.provider, {
        nonce: challenge,
        derivationIndex: 0,
      });

      return {
        challenge,
        signatures: [signature],
      };
    } catch (err) {
      if (err?.code === METAMASK_ERRORS_CODE.REJECTED) {
        err.code = WALLET_API_PROVIDER_ERRORS_CODE.REJECTED;
      }

      throw err;
    }
  },
  logout: async () => {
    metaMaskWalletProvider.provider = null;
  },
};
