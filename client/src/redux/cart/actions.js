export const prefix = 'cart';

export const ADD_ITEM = `${prefix}/ADD_ITEM`;
export const DELETE_ITEM = `${prefix}/DELETE_ITEM`;
export const CLEAR_CART = `${prefix}/CLEAR_CART`;

export const addItem = item => ({
  type: ADD_ITEM,
  data: item,
});

export const deleteItem = ({ id, cart }) => ({
  type: DELETE_ITEM,
  data: { id, cart },
});

export const clear = () => ({
  type: CLEAR_CART,
});
