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
    return undefined;
  }
};

export const getPublicKey = async () => {
  const res = await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId: defaultSnapOrigin,
      request: {
        method: 'showPublicKey',
      },
    },
  });

  return res;
};

export const signTxn = async () => {
  const res = await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId: defaultSnapOrigin,
      request: {
        method: 'signTransaction',
        params: {
          apiUrl: 'https://fiotestnet.blockpane.com',
          contract: 'fio.address',
          action: 'addaddress',
          data: {
            fio_address: 'gatest01@regtest',
            public_addresses: [
              {
                chain_code: 'BCH',
                token_code: 'BCH',
                public_address: 'bitcoincash:somebitcoincashpublicaddress',
              },
            ],
            max_fee: 600000000,
            tpid: 'dashboard@fiouat',
            actor: 'ozb2hshyezbw',
          },
        },
      },
    },
  });

  return res?.txn;
};
