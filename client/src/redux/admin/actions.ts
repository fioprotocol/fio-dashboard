import { Api } from '../../api';

import { minWaitTimeFunction } from '../../utils';

import { CommonPromiseAction } from '../types';

export const prefix = 'admin';

export const GET_ADMIN_USERS_REQUEST = `${prefix}/GET_ADMIN_USERS_REQUEST`;
export const GET_ADMIN_USERS_SUCCESS = `${prefix}/GET_ADMIN_USERS_SUCCESS`;
export const GET_ADMIN_USERS_FAILURE = `${prefix}/GET_ADMIN_USERS_FAILURE`;

export const getAdminList = (): CommonPromiseAction => ({
  types: [
    GET_ADMIN_USERS_REQUEST,
    GET_ADMIN_USERS_SUCCESS,
    GET_ADMIN_USERS_FAILURE,
  ],
  promise: (api: Api) => api.admin.list(),
});

export const DELETE_ADMIN_USER_REQUEST = `${prefix}/DELETE_ADMIN_USER_REQUEST`;
export const DELETE_ADMIN_USER_SUCCESS = `${prefix}/DELETE_ADMIN_USER_SUCCESS`;
export const DELETE_ADMIN_USER_FAILURE = `${prefix}/DELETE_ADMIN_USER_FAILURE`;

export const removeAdminUser = (adminUserId: string): CommonPromiseAction => ({
  types: [
    DELETE_ADMIN_USER_REQUEST,
    DELETE_ADMIN_USER_SUCCESS,
    DELETE_ADMIN_USER_FAILURE,
  ],
  promise: (api: Api) =>
    minWaitTimeFunction(() => api.admin.remove(adminUserId), 1000),
  adminUserId,
});
