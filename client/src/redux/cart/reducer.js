import * as actions from './actions';

export default function reducer(state = [], action = {}) {
  switch (action.type) {
    case actions.ADD_ITEM:
      return [...state, action.data];
    case actions.DELETE_ITEM:
      return state.filter(item => item.id !== action.data);
    case actions.CLEAR_CART:
      return [];
    default:
      return state;
  }
}
