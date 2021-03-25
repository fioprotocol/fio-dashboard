export const prefix = 'modal';

export const SHOW_LOGIN = `${prefix}/SHOW_LOGIN`;
export const CLOSE_LOGIN = `${prefix}/CLOSE_LOGIN`;

export const showLoginModal = () => ({
  type: SHOW_LOGIN
});

export const closeLoginModal = () => ({
  type: CLOSE_LOGIN,
});
