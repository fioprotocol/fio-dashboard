import { MetaMaskInpageProvider } from '@metamask/providers';

import { defaultSnapOrigin } from '../constants';

export type GetSnapsResponse = Record<string, Snap>;

export type Snap = {
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
    console.log('Failed to obtain installed snap', error);
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
  const txn = await window.ethereum.request({
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