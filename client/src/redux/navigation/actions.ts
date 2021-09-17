export const prefix = 'navigation';

export const SET_REDIRECT_PATH = `${prefix}/SET_REDIRECT_PATH`;

export const setRedirectPath = (hasRedirect: string) => ({
  type: SET_REDIRECT_PATH,
  data: hasRedirect,
});
