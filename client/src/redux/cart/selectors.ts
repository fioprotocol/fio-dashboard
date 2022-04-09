import { prefix } from './actions';

import { ReduxState } from '../init';
import { CartItem } from '../../types';

export const cartItems = (state: ReduxState): CartItem[] =>
  state[prefix].cartItems || [];
export const paymentWalletPublicKey = (state: ReduxState): string =>
  state[prefix].paymentWalletPublicKey || '';
export const cartDate = (state: ReduxState): number | null =>
  state[prefix].date || null;
