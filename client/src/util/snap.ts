import { MetaMaskInpageProvider } from '@metamask/providers';

import { defaultSnapOrigin } from '../landing-pages/fio-wallet-snap-landing-page/constants';
import { log } from './general';

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
  provider?: MetaMaskInpageProvider,
) => {
  await (provider ?? window.ethereum).request({
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

export const getSnap = async (
  provider?: MetaMaskInpageProvider,
  version?: string,
): Promise<Snap | undefined> => {
  try {
    const snaps = await getSnaps(provider);

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
  provider: MetaMaskInpageProvider,
  params: { derivationIndex?: number } = {},
): Promise<string> => {
  const res = (await provider.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId: defaultSnapOrigin,
      request: {
        method: 'showPublicKey',
        params,
      },
    },
  })) as string;

  return res;
};

export const signTxn = async (
  provider: MetaMaskInpageProvider,
  params: any,
): Promise<string> => {
  const txn: string = (await provider.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId: defaultSnapOrigin,
      request: {
        method: 'signTransaction',
        params,
      },
    },
  })) as string;

  return txn;
};

export const signNonce = async (
  provider: MetaMaskInpageProvider,
  params: {
    nonce: string;
    derivationIndex?: number;
  },
): Promise<string> => {
  return (await provider.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId: defaultSnapOrigin,
      request: {
        method: 'signNonce',
        params,
      },
    },
  })) as string;
};

export const decryptContent = async (
  provider: MetaMaskInpageProvider,
  params: {
    content: string;
    derivationIndex?: number;
    encryptionPublicKey: string;
    contentType: string;
  },
) => {
  return await provider.request({
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
