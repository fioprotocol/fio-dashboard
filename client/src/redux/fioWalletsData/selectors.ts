import { ReduxState } from '../init';
import { prefix } from './actions';
import { UsersFioWalletsData, UsersWalletsTxHistory } from '../../types';

export const fioWalletsData = (state: ReduxState): UsersFioWalletsData =>
  state[prefix].walletsData;
export const fioWalletsTxHistory = (state: ReduxState): UsersWalletsTxHistory =>
  state[prefix].walletsTxHistory;
export const walletDataPublicKey = (state: ReduxState): string =>
  state[prefix].walletDataPublicKey;
