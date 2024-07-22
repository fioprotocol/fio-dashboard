import Cookies from 'js-cookie';

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

  if (document.location.protocol === 'https:') {
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
