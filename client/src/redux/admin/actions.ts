import { Api } from '../../api';

import { DEFAULT_LIMIT, DEFAULT_OFFSET } from '../../hooks/usePagination';

import { minWaitTimeFunction } from '../../utils';

import { OrderListFilters } from '../../types';

import { CommonPromiseAction } from '../types';

export const prefix = 'admin';

export const GET_ADMIN_USERS_REQUEST = `${prefix}/GET_ADMIN_USERS_REQUEST`;
export const GET_ADMIN_USERS_SUCCESS = `${prefix}/GET_ADMIN_USERS_SUCCESS`;
export const GET_ADMIN_USERS_FAILURE = `${prefix}/GET_ADMIN_USERS_FAILURE`;

export const getAdminUsersList = (
  limit = DEFAULT_LIMIT,
  offset = DEFAULT_OFFSET,
): CommonPromiseAction => ({
  types: [
    GET_ADMIN_USERS_REQUEST,
    GET_ADMIN_USERS_SUCCESS,
    GET_ADMIN_USERS_FAILURE,
  ],
  promise: (api: Api) => api.admin.adminList(limit, offset),
});

export const GET_ADMIN_USER_PROFILE_REQUEST = `${prefix}/GET_ADMIN_USER_PROFILE_REQUEST`;
export const GET_ADMIN_USER_PROFILE_SUCCESS = `${prefix}/GET_ADMIN_USER_PROFILE_SUCCESS`;
export const GET_ADMIN_USER_PROFILE_FAILURE = `${prefix}/GET_ADMIN_USER_PROFILE_FAILURE`;

export const getAdminUserProfile = (id: string): CommonPromiseAction => ({
  types: [
    GET_ADMIN_USER_PROFILE_REQUEST,
    GET_ADMIN_USER_PROFILE_SUCCESS,
    GET_ADMIN_USER_PROFILE_FAILURE,
  ],
  promise: (api: Api) => api.admin.adminUserProfile(id),
});

export const GET_ORDERS_LIST_BY_ADMIN_REQUEST = `${prefix}/GET_ORDERS_LIST_BY_ADMIN_REQUEST`;
export const GET_ORDERS_LIST_BY_ADMIN_SUCCESS = `${prefix}/GET_ORDERS_LIST_BY_ADMIN_SUCCESS`;
export const GET_ORDERS_LIST_BY_ADMIN_FAILURE = `${prefix}/GET_ORDERS_LIST_BY_ADMIN_FAILURE`;

export const getOrdersList = (
  limit: number | null = DEFAULT_LIMIT,
  offset: number | null = DEFAULT_OFFSET,
  filters: OrderListFilters,
): CommonPromiseAction => ({
  types: [
    GET_ORDERS_LIST_BY_ADMIN_REQUEST,
    GET_ORDERS_LIST_BY_ADMIN_SUCCESS,
    GET_ORDERS_LIST_BY_ADMIN_FAILURE,
  ],
  promise: (api: Api) => api.admin.ordersList(limit, offset, filters),
});

export const ADMIN_SEARCH_REQUEST = `${prefix}/ADMIN_SEARCH_REQUEST`;
export const ADMIN_SEARCH_SUCCESS = `${prefix}/ADMIN_SEARCH_SUCCESS`;
export const ADMIN_SEARCH_FAILURE = `${prefix}/ADMIN_SEARCH_FAILURE`;

export const adminSearch = (value: string): CommonPromiseAction => ({
  types: [ADMIN_SEARCH_REQUEST, ADMIN_SEARCH_SUCCESS, ADMIN_SEARCH_FAILURE],
  promise: (api: Api) => api.admin.search(value),
});

export const GET_ORDER_BY_ADMIN_REQUEST = `${prefix}/GET_ORDER_BY_ADMIN_REQUEST`;
export const GET_ORDER_BY_ADMIN_SUCCESS = `${prefix}/GET_ORDER_BY_ADMIN_SUCCESS`;
export const GET_ORDER_BY_ADMIN_FAILURE = `${prefix}/GET_ORDER_BY_ADMIN_FAILURE`;

export const getOrder = (id: string): CommonPromiseAction => ({
  types: [
    GET_ORDER_BY_ADMIN_REQUEST,
    GET_ORDER_BY_ADMIN_SUCCESS,
    GET_ORDER_BY_ADMIN_FAILURE,
  ],
  promise: (api: Api) => api.admin.order(id),
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
    minWaitTimeFunction(() => api.admin.removeAdmin(adminUserId), 1000),
  adminUserId,
});

export const RESET_ADMIN_USER_PASSWORD_REQUEST = `${prefix}/RESET_ADMIN_USER_PASSWORD_REQUEST`;
export const RESET_ADMIN_USER_PASSWORD_SUCCESS = `${prefix}/RESET_ADMIN_USER_PASSWORD_SUCCESS`;
export const RESET_ADMIN_USER_PASSWORD_FAILURE = `${prefix}/RESET_ADMIN_USER_PASSWORD_FAILURE`;

export const resetAdminUserPassword = (
  adminUserId: string,
): CommonPromiseAction => ({
  types: [
    RESET_ADMIN_USER_PASSWORD_REQUEST,
    RESET_ADMIN_USER_PASSWORD_SUCCESS,
    RESET_ADMIN_USER_PASSWORD_FAILURE,
  ],
  promise: (api: Api) =>
    minWaitTimeFunction(
      () => api.admin.sendResetAdminPassword(adminUserId),
      1000,
    ),
  adminUserId,
});

export const GET_FIO_ACCOUNTS_PROFILES_REQUEST = `${prefix}/GET_FIO_ACCOUNTS_PROFILES_REQUEST`;
export const GET_FIO_ACCOUNTS_PROFILES_SUCCESS = `${prefix}/GET_FIO_ACCOUNTS_PROFILES_SUCCESS`;
export const GET_FIO_ACCOUNTS_PROFILES_FAILURE = `${prefix}/GET_FIO_ACCOUNTS_PROFILES_FAILURE`;

export const getFioAccountsProfilesList = (
  limit = DEFAULT_LIMIT,
  offset = DEFAULT_OFFSET,
): CommonPromiseAction => ({
  types: [
    GET_FIO_ACCOUNTS_PROFILES_REQUEST,
    GET_FIO_ACCOUNTS_PROFILES_SUCCESS,
    GET_FIO_ACCOUNTS_PROFILES_FAILURE,
  ],
  promise: (api: Api) => api.admin.fioAccountsProfilesList(limit, offset),
});

export const GET_PARTNERS_REQUEST = `${prefix}/GET_PARTNERS_REQUEST`;
export const GET_PARTNERS_SUCCESS = `${prefix}/GET_PARTNERS_SUCCESS`;
export const GET_PARTNERS_FAILURE = `${prefix}/GET_PARTNERS_FAILURE`;

export const getPartnersList = (
  limit = DEFAULT_LIMIT,
  offset = DEFAULT_OFFSET,
  filters = {},
): CommonPromiseAction => ({
  types: [GET_PARTNERS_REQUEST, GET_PARTNERS_SUCCESS, GET_PARTNERS_FAILURE],
  promise: (api: Api) => api.admin.partnersList(limit, offset, filters),
});

export const GET_REGULAR_USERS_REQUEST = `${prefix}/GET_REGULAR_USERS_REQUEST`;
export const GET_REGULAR_USERS_SUCCESS = `${prefix}/GET_REGULAR_USERS_SUCCESS`;
export const GET_REGULAR_USERS_FAILURE = `${prefix}/GET_REGULAR_USERS_FAILURE`;

export const getRegularUsersList = ({
  limit = DEFAULT_LIMIT,
  offset = DEFAULT_OFFSET,
  filters,
  includeMoreDetailedInfo,
}: {
  limit: number;
  offset: number;
  filters?: { userOption?: string };
  includeMoreDetailedInfo?: boolean;
}): CommonPromiseAction => ({
  types: [
    GET_REGULAR_USERS_REQUEST,
    GET_REGULAR_USERS_SUCCESS,
    GET_REGULAR_USERS_FAILURE,
  ],
  promise: (api: Api) =>
    api.admin.usersList({ limit, offset, filters, includeMoreDetailedInfo }),
});

export const GET_FIO_API_URLS_REQUEST = `${prefix}/GET_FIO_API_URLS_REQUEST`;
export const GET_FIO_API_URLS_SUCCESS = `${prefix}/GET_FIO_API_URLS_SUCCESS`;
export const GET_FIO_API_URLS_FAILURE = `${prefix}/GET_FIO_API_URLS_FAILURE`;

export const getFioApiUrlsList = (
  limit = DEFAULT_LIMIT,
  offset = DEFAULT_OFFSET,
): CommonPromiseAction => ({
  types: [
    GET_FIO_API_URLS_REQUEST,
    GET_FIO_API_URLS_SUCCESS,
    GET_FIO_API_URLS_FAILURE,
  ],
  promise: (api: Api) => api.admin.getFioApiUrlsList(limit, offset),
});
