import { ReduxState } from '../init';
import { prefix } from './actions';

export const fioWalletsData = (state: ReduxState) => state[prefix].walletsData;
export const fioWalletsTxHistory = (state: ReduxState) =>
  state[prefix].walletsTxHistory;
export const walletDataPublicKey = (state: ReduxState) =>
  state[prefix].walletDataPublicKey;
