import { CartItem } from '../../types';
import { CommonAction, CommonPromiseAction } from '../types';
import { Api } from '../../api';

export const prefix = 'cart';

export const CLEAR_CART = `${prefix}/CLEAR_CART`;
export const SET_CART_ITEMS = `${prefix}/SET_CART_ITEMS`;
export const SET_OLD_CART = `${prefix}/SET_OLD_CART`;

export const ADD_ITEM_REQUEST = `${prefix}/ADD_ITEM_REQUEST`;
export const ADD_ITEM_SUCCESS = `${prefix}/ADD_ITEM_SUCCESS`;
export const ADD_ITEM_FAILURE = `${prefix}/ADD_ITEM_FAILURE`;

export const addItem = ({
  id,
  item,
}: {
  id?: string;
  item: CartItem;
}): CommonPromiseAction => ({
  types: [ADD_ITEM_REQUEST, ADD_ITEM_SUCCESS, ADD_ITEM_FAILURE],
  promise: (api: Api) => api.cart.addItem({ id, item }),
});

export const DELETE_ITEM_REQUEST = `${prefix}/DELETE_ITEM_REQUEST`;
export const DELETE_ITEM_SUCCESS = `${prefix}/DELETE_ITEM_SUCCESS`;
export const DELETE_ITEM_FAILURE = `${prefix}/DELETE_ITEM_FAILURE`;

export const deleteItem = ({
  id,
  itemId,
}: {
  id: string;
  itemId: string;
}): CommonPromiseAction => ({
  types: [DELETE_ITEM_REQUEST, DELETE_ITEM_SUCCESS, DELETE_ITEM_FAILURE],
  promise: (api: Api) => api.cart.deleteItem({ id, itemId }),
});

export const UPDATE_CART_ITEM_PERIOD_REQUEST = `${prefix}/UPDATE_CART_ITEM_PERIOD_REQUEST`;
export const UPDATE_CART_ITEM_PERIOD_SUCCESS = `${prefix}/UPDATE_CART_ITEM_PERIOD_SUCCESS`;
export const UPDATE_CART_ITEM_PERIOD_FAILURE = `${prefix}/UPDATE_CART_ITEM_PERIOD_FAILURE`;

export const updateCartItemPeriod = (data: {
  id: string;
  itemId: string;
  period: number;
}): CommonPromiseAction => ({
  types: [
    UPDATE_CART_ITEM_PERIOD_REQUEST,
    UPDATE_CART_ITEM_PERIOD_SUCCESS,
    UPDATE_CART_ITEM_PERIOD_FAILURE,
  ],
  promise: (api: Api) => api.cart.updateItemPeriod(data),
});

export const addToOldCart = (
  orderId: string,
  cart: CartItem[],
): CommonAction => ({
  type: SET_OLD_CART,
  data: { orderId, cart },
});

export const clear = (isNotify = false): CommonAction => ({
  type: CLEAR_CART,
  data: isNotify,
});

export const setCartItems = (cartItems: CartItem[]): CommonAction => ({
  type: SET_CART_ITEMS,
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

export const CLEAR_OLD_CART = `${prefix}/CLEAR_OLD_CART`;

export const clearOldCartItems = (): CommonAction => ({
  type: CLEAR_OLD_CART,
});
