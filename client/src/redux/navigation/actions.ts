import { RedirectLinkData } from '../../types';

export const prefix = 'navigation';

export const SET_REDIRECT_PATH = `${prefix}/SET_REDIRECT_PATH`;

export const setRedirectPath = (redirectLink: RedirectLinkData) => ({
  type: SET_REDIRECT_PATH,
  data: redirectLink,
});
