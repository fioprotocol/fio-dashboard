import { prefix } from './actions';

export const cartItems = state => state[prefix].cartItems || [];
export const paymentWalletPublicKey = state =>
  state[prefix].paymentWalletPublicKey || '';
export const cartDate = state => state[prefix].date || null;
