import { prefix } from './actions';

export const cartItems = state => state[prefix].cartItems || [];
export const paymentWalletID = state => state[prefix].paymentWalletID || '';
