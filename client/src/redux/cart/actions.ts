import { CartItem } from '../../types';
import { CommonAction } from '../types';

export const prefix = 'cart';

export const ADD_ITEM = `${prefix}/ADD_ITEM`;
export const DELETE_ITEM = `${prefix}/DELETE_ITEM`;
export const CLEAR_CART = `${prefix}/CLEAR_CART`;
export const RECALCULATE_CART = `${prefix}/RECALCULATE_CART`;
export const SET_CART_DATE = `${prefix}/SET_CART_DATE`;

export const addItem = (item: CartItem): CommonAction => ({
  type: ADD_ITEM,
  data: item,
});

export const deleteItem = ({
  id,
  cartItems,
}: {
  id: string;
  cartItems: CartItem[];
}): CommonAction => ({
  type: DELETE_ITEM,
  data: { id, cartItems },
});

export const clear = (): CommonAction => ({
  type: CLEAR_CART,
});

export const recalculate = (cartItems: CartItem[]): CommonAction => ({
  type: RECALCULATE_CART,
  data: cartItems,
});

export const SET_WALLET_FOR_PAYMENT = `${prefix}/SET_WALLET_FOR_PAYMENT`;
export const UNSET_WALLET_FOR_PAYMENT = `${prefix}/UNSET_WALLET_FOR_PAYMENT`;

export const setWallet = (walletPublicKey: string): CommonAction => ({
  type: SET_WALLET_FOR_PAYMENT,
  data: walletPublicKey,
});

export const unsetWallet = (): CommonAction => ({
  type: UNSET_WALLET_FOR_PAYMENT,
});

export const setCartDate = (date: number): CommonAction => ({
  type: SET_CART_DATE,
  data: date,
});
