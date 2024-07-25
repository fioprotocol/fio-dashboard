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

    // We need to get domain hostname from env because of reg site migration that has other origin - fioprotocol.io
    const url = new URL(process.env.REACT_APP_API_BASE_URL);
    const hostParts = url.hostname.split('.');
    if (hostParts.length > 2) {
      paramsToSet.domain = `.${hostParts.slice(-2).join('.')}`;
    } else {
      paramsToSet.domain = url.hostname;
    }
  }

  if (!cookieValue) {
    Cookies.remove(cookieName, paramsToSet);
  } else {
    Cookies.set(cookieName, cookieValue, paramsToSet);
  }
};
