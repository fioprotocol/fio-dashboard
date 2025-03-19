import { Ecc } from '@fioprotocol/fiojs';

import { waitWalletKeys } from '../../util/edge';

import apis from '../../api';

import { WalletAuthResult, WalletAuthParams } from './types';
import { EdgeWalletsKeys, Nonce } from '../../types';

export const generateSignatures = async (
  keys: EdgeWalletsKeys,
): Promise<Nonce> => {
  const { nonce: challenge } = await apis.auth.userNonce();

  return {
    challenge,
    signatures: challenge
      ? Object.values(keys).map(keysItem =>
          Ecc.sign(challenge, keysItem.private),
        )
      : [],
  };
};

export const authenticateWallet = async ({
  account,
  authParams: { username, password },
  opt,
}: WalletAuthParams): Promise<WalletAuthResult> => {
  const { logout = true } = opt || {};

  if (!account) {
    try {
      account = await apis.edge.login(username, password);
    } catch (error) {
      throw { ...error, code: 'AUTHENTICATION_FAILED' };
    }
  }

  try {
    const keys = await waitWalletKeys(account);

    const nonce = await generateSignatures(keys);

    if (logout) {
      await account.logout();
    }

    return {
      account,
      keys,
      nonce,
    };
  } catch (error) {
    await account?.logout();

    throw error;
  }
};
