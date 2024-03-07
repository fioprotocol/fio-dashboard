import { prefix } from './actions';
import { ReduxState } from '../init';

export const loading = (state: ReduxState): boolean => state[prefix].loading;
export const addWalletLoading = (state: ReduxState): boolean =>
  state[prefix].addWalletLoading;
export const walletHasBeenAdded = (state: ReduxState): boolean =>
  state[prefix].walletHasBeenAdded;
