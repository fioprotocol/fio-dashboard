import Cookies from 'js-cookie';

import { REFERRAL_PROFILE_COOKIE_NAME } from '../constants/cookies';

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
  const paramsToSet = { ...params };

  if (
    document.location.protocol === 'https:' &&
    cookieName !== REFERRAL_PROFILE_COOKIE_NAME
  ) {
    paramsToSet.secure = true;

    const hostParts = document.location.hostname.split('.');
    if (hostParts.length > 2) {
      paramsToSet.domain = `.${hostParts.slice(-2).join('.')}`;
    } else {
      paramsToSet.domain = document.location.hostname;
    }
  }

  if (!cookieValue) {
    Cookies.remove(cookieName, paramsToSet);
  } else {
    Cookies.set(cookieName, cookieValue, paramsToSet);
  }
};
