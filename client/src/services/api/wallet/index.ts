import apis from '../../../api';

import { WalletAuthParams, WalletApiProvider } from '../types';
import { Nonce } from '../../../types';

import { edgeWalletProvider } from './edge';
import { metaMaskWalletProvider } from './metamask';

export const generateSignatures = async (
  walletApiProvider: WalletApiProvider,
): Promise<Nonce> => {
  const { nonce: challenge } = await apis.auth.userNonce();

  return walletApiProvider.generateSignatures(challenge);
};

export const authenticateWallet = async ({
  walletProviderName,
  authParams,
}: WalletAuthParams): Promise<{
  walletApiProvider: WalletApiProvider;
  nonce: Nonce;
}> => {
  let walletApiProvider = null;

  switch (walletProviderName) {
    case 'edge':
      walletApiProvider = edgeWalletProvider;
      break;
    case 'metamask':
      walletApiProvider = metaMaskWalletProvider;
      break;
  }

  await walletApiProvider.authenticate(authParams);

  try {
    const nonce = await generateSignatures(walletApiProvider);

    return { walletApiProvider, nonce };
  } catch (error) {
    await walletApiProvider.logout();

    throw error;
  }
};
