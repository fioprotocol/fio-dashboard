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
  if (!cookieValue) return Cookies.remove(cookieName, params);

  if (document.location.protocol === 'https:') {
    params.secure = true;

    const hostParts = document.location.hostname.split('.');
    if (hostParts.length > 2) {
      params.domain = `.${hostParts.slice(-2).join('.')}`;
    } else {
      params.domain = document.location.hostname;
    }
  }

  Cookies.set(cookieName, cookieValue, params);
};
