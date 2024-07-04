import Cookies from 'js-cookie';

import config from '../config';

export const setCookies = (
  cookieName: string,
  cookieValue: string,
  params: {
    expires?: number;
    path?: string;
    secure?: boolean;
    domain?: string;
  } = {
    path: '/',
  },
): void => {
  if (!cookieValue) return Cookies.remove(cookieName, params);

  if (document.location.protocol === 'https:') {
    params.secure = true;
    params.domain = config.apiBaseUrl
      ?.replace(/^.*:\/\//i, '')
      .replace('/', '');
  }

  Cookies.set(cookieName, cookieValue, params);
};
