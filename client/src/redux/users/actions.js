export const prefix = 'users';

export const LIST_REQUEST = `${prefix}/LIST_REQUEST`;
export const LIST_SUCCESS = `${prefix}/LIST_SUCCESS`;
export const LIST_FAILURE = `${prefix}/LIST_FAILURE`;

export const listUsers = () => ({
  types: [LIST_REQUEST, LIST_SUCCESS, LIST_FAILURE],
  promise: api => api.users.list(),
});

export const SHOW_REQUEST = `${prefix}/SHOW_REQUEST`;
export const SHOW_SUCCESS = `${prefix}/SHOW_SUCCESS`;
export const SHOW_FAILURE = `${prefix}/SHOW_FAILURE`;

export const showUser = id => ({
  types: [SHOW_REQUEST, SHOW_SUCCESS, SHOW_FAILURE],
  promise: api => api.users.show(id),
  id,
});

export const HIDE = `${prefix}/HIDE`;

export const hideUser = () => ({
  type: HIDE,
});
