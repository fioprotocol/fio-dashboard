import { CartItem, NativePrices } from '../../types';
import { CommonAction, CommonPromiseAction } from '../types';
import { Api } from '../../api';

export const prefix = 'cart';

export const SET_CART_ITEMS = `${prefix}/SET_CART_ITEMS`;
export const SET_OLD_CART = `${prefix}/SET_OLD_CART`;

export const ADD_ITEM_REQUEST = `${prefix}/ADD_ITEM_REQUEST`;
export const ADD_ITEM_SUCCESS = `${prefix}/ADD_ITEM_SUCCESS`;
export const ADD_ITEM_FAILURE = `${prefix}/ADD_ITEM_FAILURE`;

export const addItem = ({
  id,
  item,
  prices,
  roe,
}: {
  id?: string;
  item: CartItem;
  prices?: NativePrices;
  roe?: number;
}): CommonPromiseAction => ({
  types: [ADD_ITEM_REQUEST, ADD_ITEM_SUCCESS, ADD_ITEM_FAILURE],
  promise: (api: Api) => api.cart.addItem({ id, item, prices, roe }),
});

export const DELETE_ITEM_REQUEST = `${prefix}/DELETE_ITEM_REQUEST`;
export const DELETE_ITEM_SUCCESS = `${prefix}/DELETE_ITEM_SUCCESS`;
export const DELETE_ITEM_FAILURE = `${prefix}/DELETE_ITEM_FAILURE`;

export const deleteItem = (data: {
  id: string;
  itemId: string;
  prices: NativePrices;
  roe: number;
}): CommonPromiseAction => ({
  types: [DELETE_ITEM_REQUEST, DELETE_ITEM_SUCCESS, DELETE_ITEM_FAILURE],
  promise: (api: Api) => api.cart.deleteItem(data),
});

export const UPDATE_CART_ITEM_PERIOD_REQUEST = `${prefix}/UPDATE_CART_ITEM_PERIOD_REQUEST`;
export const UPDATE_CART_ITEM_PERIOD_SUCCESS = `${prefix}/UPDATE_CART_ITEM_PERIOD_SUCCESS`;
export const UPDATE_CART_ITEM_PERIOD_FAILURE = `${prefix}/UPDATE_CART_ITEM_PERIOD_FAILURE`;

export const updateCartItemPeriod = (data: {
  id: string;
  itemId: string;
  period: number;
  prices: NativePrices;
  roe: number;
}): CommonPromiseAction => ({
  types: [
    UPDATE_CART_ITEM_PERIOD_REQUEST,
    UPDATE_CART_ITEM_PERIOD_SUCCESS,
    UPDATE_CART_ITEM_PERIOD_FAILURE,
  ],
  promise: (api: Api) => api.cart.updateItemPeriod(data),
});

export const HANDLE_USERS_FREE_CART_ITEMS_REQUEST = `${prefix}/HANDLE_USERS_FREE_CART_ITEMS_REQUEST`;
export const HANDLE_USERS_FREE_CART_ITEMS_SUCCESS = `${prefix}/HANDLE_USERS_FREE_CART_ITEMS_SUCCESS`;
export const HANDLE_USERS_FREE_CART_ITEMS_FAILURE = `${prefix}/HANDLE_USERS_FREE_CART_ITEMS_FAILURE`;

export const handleUsersFreeCartItems = (data: {
  id: string;
  userId?: string;
}): CommonPromiseAction => ({
  types: [
    HANDLE_USERS_FREE_CART_ITEMS_REQUEST,
    HANDLE_USERS_FREE_CART_ITEMS_SUCCESS,
    HANDLE_USERS_FREE_CART_ITEMS_FAILURE,
  ],
  promise: (api: Api) => api.cart.handleUsersFreeCartItems(data),
});

export const RECALCULATE_CART_ITEMS_ON_PRICES_UPDATE_REQUEST = `${prefix}/RECALCULATE_CART_ITEMS_ON_PRICES_UPDATE_REQUEST`;
export const RECALCULATE_CART_ITEMS_ON_PRICES_UPDATE_SUCCESS = `${prefix}/RECALCULATE_CART_ITEMS_ON_PRICES_UPDATE_SUCCESS`;
export const RECALCULATE_CART_ITEMS_ON_PRICES_UPDATE_FAILURE = `${prefix}/RECALCULATE_CART_ITEMS_ON_PRICES_UPDATE_FAILURE`;

export const recalculateOnPriceUpdate = (data: {
  id: string;
  prices: NativePrices;
  roe: number;
}): CommonPromiseAction => ({
  types: [
    RECALCULATE_CART_ITEMS_ON_PRICES_UPDATE_REQUEST,
    RECALCULATE_CART_ITEMS_ON_PRICES_UPDATE_SUCCESS,
    RECALCULATE_CART_ITEMS_ON_PRICES_UPDATE_FAILURE,
  ],
  promise: (api: Api) => api.cart.recalculateOnPriceUpdate(data),
});

export const addToOldCart = (
  orderId: string,
  cart: CartItem[],
): CommonAction => ({
  type: SET_OLD_CART,
  data: { orderId, cart },
});

export const CLEAR_CART_REQUEST = `${prefix}/CLEAR_CART_REQUEST`;
export const CLEAR_CART_SUCCESS = `${prefix}/CLEAR_CART_SUCCESS`;
export const CLEAR_CART_FAILURE = `${prefix}/CLEAR_CART_FAILURE`;

export const clearCart = ({
  id,
  isNotify = false,
}: {
  id: string;
  isNotify?: boolean;
}): CommonPromiseAction => ({
  types: [CLEAR_CART_REQUEST, CLEAR_CART_SUCCESS, CLEAR_CART_FAILURE],
  promise: (api: Api) => api.cart.clearCart(id),
  data: isNotify,
});

export const UPDATE_CART_USER_ID_REQUEST = `${prefix}/UPDATE_CART_USER_ID_REQUEST`;
export const UPDATE_CART_USER_ID_SUCCESS = `${prefix}/UPDATE_CART_USER_ID_SUCCESS`;
export const UPDATE_CART_USER_ID_FAILURE = `${prefix}/UPDATE_CART_USER_ID_FAILURE`;

export const updateUserId = (cartId: string): CommonPromiseAction => ({
  types: [
    UPDATE_CART_USER_ID_REQUEST,
    UPDATE_CART_USER_ID_SUCCESS,
    UPDATE_CART_USER_ID_FAILURE,
  ],
  promise: (api: Api) => api.cart.updateUserId(cartId),
});

export const GET_CART_REQUEST_REQUEST = `${prefix}/GET_CART_REQUEST_REQUEST`;
export const GET_CART_REQUEST_SUCCESS = `${prefix}/GET_CART_REQUEST_SUCCESS`;
export const GET_CART_REQUEST_FAILURE = `${prefix}/GET_CART_REQUEST_FAILURE`;

export const getCart = (cartId: string): CommonPromiseAction => ({
  types: [
    GET_CART_REQUEST_REQUEST,
    GET_CART_REQUEST_SUCCESS,
    GET_CART_REQUEST_FAILURE,
  ],
  promise: (api: Api) => api.cart.getCart(cartId),
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
