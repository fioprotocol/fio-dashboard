import { prefix } from './actions';

export const cartItems = state => state[prefix].cartItems || [];
export const paymentWallet = state => state[prefix].paymentWallet || '';
