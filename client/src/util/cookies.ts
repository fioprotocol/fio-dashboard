import Cookies from 'js-cookie';

export const setCookies = (
  cookieName: string,
  cookieValue: string,
  params: { expires?: number; path?: string } = {
    path: '/',
  },
): void => {
  if (!cookieValue) return Cookies.remove(cookieName, params);
  Cookies.set(cookieName, cookieValue, {
    ...params,
    secure: document.location.protocol === 'https:',
    sameSite: 'none',
  });
};
