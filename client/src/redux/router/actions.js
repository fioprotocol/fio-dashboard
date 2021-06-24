export const prefix = 'router';

export const SET_REDIRECT_PATH = `${prefix}/SET_REDIRECT_PATH`;

export const setRedirectPath = hasRedirect => ({
  type: SET_REDIRECT_PATH,
  data: hasRedirect,
});
