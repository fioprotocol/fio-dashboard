import { prefix } from './actions';
import { ReduxState } from '../init';

export const loading = (state: ReduxState): boolean => state[prefix].loading;
export const addWalletLoading = (state: ReduxState): boolean =>
  state[prefix].addWalletLoading;
