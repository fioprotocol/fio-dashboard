import Cookies from 'js-cookie';

export const setCookies = (
  cookieName: string,
  cookieValue: string,
  params: { expires?: number; path?: string } = {
    path: '/',
  },
) => {
  if (!cookieValue) return Cookies.remove(cookieName, params);
  Cookies.set(cookieName, cookieValue, params);
};
