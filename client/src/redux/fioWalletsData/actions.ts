import { FioWalletData } from '../../types';

export const prefix = 'fioWalletsData';

export const UPDATE_WALLET_DATA = `${prefix}/UPDATE_WALLET_DATA`;

export const updateFioWalletsData = (
  data: FioWalletData,
  publicKey: string,
  userId: string,
) => ({
  type: UPDATE_WALLET_DATA,
  publicKey,
  userId,
  data,
});

export const REFRESH_WALLET_DATA_PUBLIC_KEY = `${prefix}/REFRESH_WALLET_DATA_PUBLIC_KEY`;

export const refreshWalletDataPublicKey = (publicKey: string) => ({
  type: REFRESH_WALLET_DATA_PUBLIC_KEY,
  publicKey,
});
