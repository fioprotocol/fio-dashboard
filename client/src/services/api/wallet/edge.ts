import { Ecc } from '@fioprotocol/fiojs';
import { EdgeAccount } from 'edge-core-js';

import { waitWalletKeys } from '../../../util/edge';

import apis from '../../../api';

import { WALLET_CREATED_FROM } from '../../../constants/common';

import { WalletApiProvider } from '../types';
import { Nonce } from '../../../types';

export interface EdgeWalletApiProvider extends WalletApiProvider {
  account: EdgeAccount | null;
  authenticate: (authParams: {
    account?: EdgeAccount;
    username?: string;
    password?: string;
  }) => Promise<void>;
}

export const edgeWalletProvider: EdgeWalletApiProvider = {
  name: WALLET_CREATED_FROM.EDGE,
  account: null,
  authenticate: async ({ account, username, password }) => {
    if (!account) {
      try {
        account = await apis.edge.login(username, password);
      } catch (error) {
        throw { ...error, code: 'AUTHENTICATION_FAILED' };
      }
    }
    edgeWalletProvider.account = account;
  },
  generateSignatures: async (challenge: string): Promise<Nonce> => {
    const keys = await waitWalletKeys(edgeWalletProvider.account);

    return {
      challenge,
      signatures: challenge
        ? Object.values(keys).map(keysItem =>
            Ecc.sign(challenge, keysItem.private),
          )
        : [],
    };
  },
  logout: async (options: { fromEdgeConfirm?: boolean } = {}) => {
    if (
      edgeWalletProvider.account &&
      edgeWalletProvider.account.loggedIn &&
      !options.fromEdgeConfirm
    ) {
      await edgeWalletProvider.account.logout();
    }
    edgeWalletProvider.account = null;
  },
};
