import { prefix } from './actions';

import { ReduxState } from '../init';
import { CartItem } from '../../types';

export const loading = (state: ReduxState): boolean => state[prefix].loading;

export const cartId = (state: ReduxState): string =>
  state[prefix].cartId || null;

export const cartItems = (state: ReduxState): CartItem[] =>
  state[prefix].cartItems || [];

export const paymentWalletPublicKey = (state: ReduxState): string =>
  state[prefix].paymentWalletPublicKey || '';
