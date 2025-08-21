import { CartItem } from '../../types';
import { CommonAction, CommonPromiseAction } from '../types';
import { Api } from '../../api';

export const prefix = 'cart';

export const ADD_ITEM_REQUEST = `${prefix}/ADD_ITEM_REQUEST`;
export const ADD_ITEM_SUCCESS = `${prefix}/ADD_ITEM_SUCCESS`;
export const ADD_ITEM_FAILURE = `${prefix}/ADD_ITEM_FAILURE`;

export const addItem = (data: {
  item: CartItem;
  publicKey?: string;
  token?: string;
  refCode?: string;
}): CommonPromiseAction => ({
  types: [ADD_ITEM_REQUEST, ADD_ITEM_SUCCESS, ADD_ITEM_FAILURE],
  promise: (api: Api) => api.cart.addItem(data),
  cartItem: data.item,
});

export const DELETE_ITEM_REQUEST = `${prefix}/DELETE_ITEM_REQUEST`;
export const DELETE_ITEM_SUCCESS = `${prefix}/DELETE_ITEM_SUCCESS`;
export const DELETE_ITEM_FAILURE = `${prefix}/DELETE_ITEM_FAILURE`;

export const deleteItem = (data: {
  itemId: string;
  item: CartItem;
  refCode?: string;
}): CommonPromiseAction => ({
  types: [DELETE_ITEM_REQUEST, DELETE_ITEM_SUCCESS, DELETE_ITEM_FAILURE],
  promise: (api: Api) => api.cart.deleteItem(data),
  cartItem: data.item,
});

export const UPDATE_CART_ITEM_PERIOD_REQUEST = `${prefix}/UPDATE_CART_ITEM_PERIOD_REQUEST`;
export const UPDATE_CART_ITEM_PERIOD_SUCCESS = `${prefix}/UPDATE_CART_ITEM_PERIOD_SUCCESS`;
export const UPDATE_CART_ITEM_PERIOD_FAILURE = `${prefix}/UPDATE_CART_ITEM_PERIOD_FAILURE`;

export const updateCartItemPeriod = (data: {
  itemId: string;
  item: CartItem;
  period: number;
}): CommonPromiseAction => ({
  types: [
    UPDATE_CART_ITEM_PERIOD_REQUEST,
    UPDATE_CART_ITEM_PERIOD_SUCCESS,
    UPDATE_CART_ITEM_PERIOD_FAILURE,
  ],
  promise: (api: Api) => api.cart.updateItemPeriod(data),
  cartItem: data.item,
  newPeriod: data.period,
});

export const HANDLE_USERS_FREE_CART_ITEMS_REQUEST = `${prefix}/HANDLE_USERS_FREE_CART_ITEMS_REQUEST`;
export const HANDLE_USERS_FREE_CART_ITEMS_SUCCESS = `${prefix}/HANDLE_USERS_FREE_CART_ITEMS_SUCCESS`;
export const HANDLE_USERS_FREE_CART_ITEMS_FAILURE = `${prefix}/HANDLE_USERS_FREE_CART_ITEMS_FAILURE`;

export const handleUsersFreeCartItems = (data: {
  publicKey?: string;
  refCode?: string;
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

export const recalculateOnPriceUpdate = (): CommonPromiseAction => ({
  types: [
    RECALCULATE_CART_ITEMS_ON_PRICES_UPDATE_REQUEST,
    RECALCULATE_CART_ITEMS_ON_PRICES_UPDATE_SUCCESS,
    RECALCULATE_CART_ITEMS_ON_PRICES_UPDATE_FAILURE,
  ],
  promise: (api: Api) => api.cart.recalculateOnPriceUpdate(),
});

export const CREATE_CART_FROM_ORDER_REQUEST = `${prefix}/CREATE_CART_FROM_ORDER_REQUEST`;
export const CREATE_CART_FROM_ORDER_SUCCESS = `${prefix}/CREATE_CART_FROM_ORDER_SUCCESS`;
export const CREATE_CART_FROM_ORDER_FAILURE = `${prefix}/CREATE_CART_FROM_ORDER_FAILURE`;

export const createCartFromOrder = ({
  orderId,
}: {
  orderId: string;
}): CommonPromiseAction => ({
  types: [
    CREATE_CART_FROM_ORDER_REQUEST,
    CREATE_CART_FROM_ORDER_SUCCESS,
    CREATE_CART_FROM_ORDER_FAILURE,
  ],
  promise: (api: Api) => api.cart.createCartFromOrder(orderId),
});

export const CLEAR_CART_REQUEST = `${prefix}/CLEAR_CART_REQUEST`;
export const CLEAR_CART_SUCCESS = `${prefix}/CLEAR_CART_SUCCESS`;
export const CLEAR_CART_FAILURE = `${prefix}/CLEAR_CART_FAILURE`;

export const clearCart = ({
  isNotify = false,
}: {
  isNotify?: boolean;
} = {}): CommonPromiseAction => ({
  types: [CLEAR_CART_REQUEST, CLEAR_CART_SUCCESS, CLEAR_CART_FAILURE],
  promise: (api: Api) => api.cart.clearCart(),
  isNotify,
});

export const GET_CART_REQUEST_REQUEST = `${prefix}/GET_CART_REQUEST_REQUEST`;
export const GET_CART_REQUEST_SUCCESS = `${prefix}/GET_CART_REQUEST_SUCCESS`;
export const GET_CART_REQUEST_FAILURE = `${prefix}/GET_CART_REQUEST_FAILURE`;

export const getCart = (): CommonPromiseAction => ({
  types: [
    GET_CART_REQUEST_REQUEST,
    GET_CART_REQUEST_SUCCESS,
    GET_CART_REQUEST_FAILURE,
  ],
  promise: (api: Api) => api.cart.getCart(),
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

export const HANDLE_DOMAIN_RENEW = `${prefix}/HANDLE_DOMAIN_RENEW`;
export const onDomainRenew = ({
  domain,
  isWatchedDomain,
}: {
  domain: string;
  isWatchedDomain?: boolean;
}): CommonAction => ({
  type: HANDLE_DOMAIN_RENEW,
  data: { domain, isWatchedDomain },
});
