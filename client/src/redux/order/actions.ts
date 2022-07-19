import { CommonPromiseAction, CreateOrderActionData } from '../types';
import { Api } from '../../api';

export const prefix = 'order';

export const CREATE_REQUEST = `${prefix}/CREATE_REQUEST`;
export const CREATE_SUCCESS = `${prefix}/CREATE_SUCCESS`;
export const CREATE_FAILURE = `${prefix}/CREATE_FAILURE`;

export const createOrder = (
  data: CreateOrderActionData,
): CommonPromiseAction => ({
  types: [CREATE_REQUEST, CREATE_SUCCESS, CREATE_FAILURE],
  promise: (api: Api) => api.orders.create(data),
});
