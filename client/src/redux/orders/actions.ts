import { Api } from '../../api';

import { CommonPromiseAction } from '../types';

export const prefix = 'orders';

export const GET_USER_ORDERS_LIST_REQUEST = `${prefix}/GET_USER_ORDERS_LIST_REQUEST`;
export const GET_USER_ORDERS_LIST_SUCCESS = `${prefix}/GET_USER_ORDERS_LIST_SUCCESS`;
export const GET_USER_ORDERS_LIST_FAILURE = `${prefix}/GET_USER_ORDERS_LIST_FAILURE`;

export const getUserOrdersList = (data: {
  publicKey?: string;
  limit: number;
  offset: number;
}): CommonPromiseAction => ({
  types: [
    GET_USER_ORDERS_LIST_REQUEST,
    GET_USER_ORDERS_LIST_SUCCESS,
    GET_USER_ORDERS_LIST_FAILURE,
  ],
  promise: (api: Api) => api.orders.getList(data),
});
