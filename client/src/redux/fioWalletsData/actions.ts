import { FioWalletData } from '../../types';

export const prefix = 'fioWalletsData';

export const UPDATE_WALLET_DATA = `${prefix}/UPDATE_WALLET_DATA`;

export const updateFioWalletsData = (
  data: FioWalletData,
  publicKey: string,
) => ({
  type: UPDATE_WALLET_DATA,
  publicKey,
  data,
});
