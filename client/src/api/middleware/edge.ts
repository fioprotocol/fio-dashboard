import { store } from '../../redux/init';

export const HandleClearCachedUser = (
  clearCahchedUserFn: () => void,
  force?: boolean,
) => {
  const state = store.getState();
  const hasTwoFactor = state.edge.hasTwoFactorAuth;

  if (!force && !hasTwoFactor) {
    clearCahchedUserFn();
  }
};
