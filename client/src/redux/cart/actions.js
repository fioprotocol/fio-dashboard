export const prefix = 'cart';

export const ADD_ITEM = `${prefix}/ADD_ITEM`;
export const DELETE_ITEM = `${prefix}/DELETE_ITEM`;
export const CLEAR_CART = `${prefix}/CLEAR_CART`;
export const RECALCULATE_CART = `${prefix}/RECALCULATE_CART`;

export const addItem = item => ({
  type: ADD_ITEM,
  data: item,
});

export const deleteItem = ({ id, cartItems }) => ({
  type: DELETE_ITEM,
  data: { id, cartItems },
});

export const clear = () => ({
  type: CLEAR_CART,
});

export const recalculate = cartItems => ({
  type: RECALCULATE_CART,
  data: cartItems,
});

export const SET_WALLET_FOR_PAYMENT = `${prefix}/SET_WALLET_FOR_PAYMENT`;
export const UNSET_WALLET_FOR_PAYMENT = `${prefix}/UNSET_WALLET_FOR_PAYMENT`;

export const setWallet = walletData => ({
  type: SET_WALLET_FOR_PAYMENT,
  data: walletData,
});

export const unsetWallet = () => ({
  type: UNSET_WALLET_FOR_PAYMENT,
});
