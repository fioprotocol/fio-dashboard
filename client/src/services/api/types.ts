import { Nonce, AnyObject } from '../../types';
import { WALLET_CREATED_FROM } from '../../constants/common';

export interface WalletAuthParams {
  walletProviderName?: typeof WALLET_CREATED_FROM[keyof typeof WALLET_CREATED_FROM];
  authParams?: AnyObject;
}

export interface WalletApiProvider {
  name: typeof WALLET_CREATED_FROM[keyof typeof WALLET_CREATED_FROM];
  authenticate: (authParams?: AnyObject) => Promise<void>;
  generateSignatures: (challenge: string) => Promise<Nonce>;
  logout: (options?: AnyObject) => Promise<void>;
}
