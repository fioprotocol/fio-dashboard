import { EdgeAccount } from 'edge-core-js';

import { EdgeWalletsKeys, Nonce } from '../../types';

export interface WalletAuthResult {
  account: EdgeAccount;
  keys: EdgeWalletsKeys;
  nonce: Nonce;
}

export interface WalletAuthParams {
  account?: EdgeAccount;
  authParams?: {
    username: string;
    password: string;
  };
  opt?: {
    logout?: boolean;
  };
}
