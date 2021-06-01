import { prefix } from './actions';

export const cartItems = state => state[prefix].cartItems || [];
export const paymentWalletId = state => state[prefix].paymentWalletId || '';
