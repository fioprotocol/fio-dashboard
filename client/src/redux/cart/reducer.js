import * as actions from './actions';

export default function reducer(state = [], action = {}) {
  switch (action.type) {
    case actions.ADD_ITEM:
      return [...state, action.data];
    case actions.DELETE_ITEM:
      if (action.data.cart) {
        return action.data.cart;
      }
      return state.filter(item => item.id !== action.data.id);
    case actions.CLEAR_CART:
      return [];
    case actions.RECALCULATE_CART:
      return action.data;
    default:
      return state;
  }
}
