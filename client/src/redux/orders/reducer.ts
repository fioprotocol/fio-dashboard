import { combineReducers } from 'redux';

import * as actions from './actions';
import { LOGOUT_SUCCESS } from '../profile/actions';

import { UserOrderDetails } from '../../types';

export default combineReducers({
  loading(state: Boolean = false, action = {}) {
    switch (action.type) {
      case actions.GET_USER_ORDERS_LIST_REQUEST:
        return true;
      case actions.GET_USER_ORDERS_LIST_SUCCESS:
      case actions.GET_USER_ORDERS_LIST_FAILURE:
        return false;
      default:
        return state;
    }
  },
  ordersList(state: UserOrderDetails[] = [], action = {}) {
    switch (action.type) {
      case LOGOUT_SUCCESS:
        return [];
      case actions.GET_USER_ORDERS_LIST_SUCCESS: {
        const ordersList = [...state];

        for (const orderItem of action.data.orders) {
          const index = ordersList.findIndex(
            ({ number }) => number === orderItem.number,
          );
          if (index < 0) {
            ordersList.push(orderItem);
            continue;
          }
          ordersList[index] = orderItem;
        }
        return ordersList.sort((a, b) =>
          new Date(a.createdAt).getTime() < new Date(b.createdAt).getTime()
            ? 1
            : -1,
        );
      }
      default:
        return state;
    }
  },
  totalOrdersCount(state: number = 0, action = {}) {
    switch (action.type) {
      case actions.GET_USER_ORDERS_LIST_SUCCESS:
        return action.data.totalOrdersCount;
      default:
        return state;
    }
  },
});
