import { ReduxState } from '../init';
import { prefix } from './actions';
import { UsersFioWalletsData } from '../../types';

export const fioWalletsData = (state: ReduxState): UsersFioWalletsData =>
  state[prefix].walletsData;
export const walletDataPublicKey = (state: ReduxState): string =>
  state[prefix].walletDataPublicKey;
