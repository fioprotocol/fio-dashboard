import { CommonPromiseAction, CreateOrderActionData } from '../types';
import { Api } from '../../api';

export const prefix = 'order';

export const CREATE_ORDER_REQUEST = `${prefix}/CREATE_ORDER_REQUEST`;
export const CREATE_ORDER_SUCCESS = `${prefix}/CREATE_ORDER_SUCCESS`;
export const CREATE_ORDER_FAILURE = `${prefix}/CREATE_ORDER_FAILURE`;

export const createOrder = (
  data: CreateOrderActionData,
): CommonPromiseAction => ({
  types: [CREATE_ORDER_REQUEST, CREATE_ORDER_SUCCESS, CREATE_ORDER_FAILURE],
  promise: (api: Api) => api.orders.create(data),
});
