import { MetaMaskInpageProvider } from '@metamask/providers';

import { signNonce } from '../../../util/snap';

import { WalletApiProvider } from '../types';
import { Nonce } from '../../../types';

export interface MetaMaskWalletApiProvider extends WalletApiProvider {
  provider: MetaMaskInpageProvider | null;
  authenticate: (authParams: {
    provider: MetaMaskInpageProvider;
  }) => Promise<void>;
}

export const metaMaskWalletProvider: MetaMaskWalletApiProvider = {
  name: 'metamask',
  provider: null,
  authenticate: async ({ provider }) => {
    metaMaskWalletProvider.provider = provider;
  },
  generateSignatures: async (challenge: string): Promise<Nonce> => {
    const signature = await signNonce(metaMaskWalletProvider.provider, {
      nonce: challenge,
      derivationIndex: 0,
    });

    return {
      challenge,
      signatures: [signature],
    };
  },
  logout: async () => {
    metaMaskWalletProvider.provider = null;
  },
};
