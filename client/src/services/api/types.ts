import { Nonce, AnyObject } from '../../types';

export interface WalletAuthParams {
  walletProviderName: 'edge' | 'metamask';
  authParams?: AnyObject;
}

export interface WalletApiProvider {
  name: 'edge' | 'metamask';
  authenticate: (authParams?: AnyObject) => Promise<void>;
  generateSignatures: (challenge: string) => Promise<Nonce>;
  logout: () => Promise<void>;
}
