import { prefix } from './actions';

import { ReduxState } from '../init';

export const cartItems = (state: ReduxState) => state[prefix].cartItems || [];
export const paymentWalletPublicKey = (state: ReduxState) =>
  state[prefix].paymentWalletPublicKey || '';
export const cartDate = (state: ReduxState) => state[prefix].date || null;
