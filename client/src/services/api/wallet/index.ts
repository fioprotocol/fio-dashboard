import apis from '../../../api';

import { edgeWalletProvider } from './edge';
import { metaMaskWalletProvider } from './metamask';

import { WALLET_CREATED_FROM } from '../../../constants/common';

import { WalletAuthParams, WalletApiProvider } from '../types';
import { Nonce } from '../../../types';

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

  if (!walletProviderName && authParams) {
    walletProviderName = authParams.password
      ? WALLET_CREATED_FROM.EDGE
      : WALLET_CREATED_FROM.METAMASK;
  }

  switch (walletProviderName) {
    case WALLET_CREATED_FROM.EDGE:
      walletApiProvider = edgeWalletProvider;
      break;
    case WALLET_CREATED_FROM.METAMASK:
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
