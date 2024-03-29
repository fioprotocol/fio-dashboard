import { MetaMaskInpageProvider } from '@metamask/providers';

import { defaultSnapOrigin } from '../landing-pages/fio-wallet-snap-landing-page/constants';
import { log } from './general';
import { USER_PROFILE_TYPE } from '../constants/profile';

export type GetSnapsResponse = Record<string, Snap>;

export type Snap = {
  enabled: boolean;
  permissionName: string;
  id: string;
  version: string;
  initialPermissions: Record<string, unknown>;
};

export const connectSnap = async (
  snapId: string = defaultSnapOrigin,
  params: Record<'version' | string, unknown> = {},
) => {
  await window.ethereum.request({
    method: 'wallet_requestSnaps',
    params: {
      [snapId]: params,
    },
  });
};

export const getSnaps = async (
  provider?: MetaMaskInpageProvider,
): Promise<GetSnapsResponse> =>
  ((await (provider ?? window.ethereum).request({
    method: 'wallet_getSnaps',
  })) as unknown) as GetSnapsResponse;

export const getSnap = async (version?: string): Promise<Snap | undefined> => {
  try {
    const snaps = await getSnaps();

    return Object.values(snaps).find(
      snap =>
        snap.id === defaultSnapOrigin && (!version || snap.version === version),
    );
  } catch (error) {
    log.error('Failed to obtain installed snap', error);
    throw error;
  }
};

export const getPublicKey = async (
  params: { derivationIndex?: number } = {},
) => {
  const res = await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId: defaultSnapOrigin,
      request: {
        method: 'showPublicKey',
        params,
      },
    },
  });

  return res;
};

export const signTxn = async (params: any) => {
  const txn: Promise<string> = await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId: defaultSnapOrigin,
      request: {
        method: 'signTransaction',
        params,
      },
    },
  });

  return txn;
};

export const signNonce = async (params: {
  nonce: string;
  derivationIndex?: number;
}) => {
  return await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId: defaultSnapOrigin,
      request: {
        method: 'signNonce',
        params,
      },
    },
  });
};

export const decryptContent = async (params: {
  content: string;
  derivationIndex?: number;
  encryptionPublicKey: string;
  contentType: string;
}) => {
  return await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId: defaultSnapOrigin,
      request: {
        method: 'decryptContent',
        params,
      },
    },
  });
};

export const getZeroIndexPublicKey = async (
  userType: string,
): Promise<string | null> => {
  if (
    window.ethereum?.isMetaMask &&
    userType === USER_PROFILE_TYPE.ALTERNATIVE
  ) {
    const zeroDerivationIndexpublicKey = await getPublicKey({
      derivationIndex: 0,
    });

    return zeroDerivationIndexpublicKey;
  }

  return null;
};
