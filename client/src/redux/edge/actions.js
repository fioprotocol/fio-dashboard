export const prefix = 'edge';

export const EDGE_CONTEXT_INIT_REQUEST = `${prefix}/EDGE_CONTEXT_INIT_REQUEST`;
export const EDGE_CONTEXT_INIT_SUCCESS = `${prefix}/EDGE_CONTEXT_INIT_SUCCESS`;
export const EDGE_CONTEXT_INIT_FAILURE = `${prefix}/EDGE_CONTEXT_INIT_FAILURE`;

export const edgeContextInit = () => ({
  types: [
    EDGE_CONTEXT_INIT_REQUEST,
    EDGE_CONTEXT_INIT_SUCCESS,
    EDGE_CONTEXT_INIT_FAILURE,
  ],
  promise: api => api.edge.makeEdgeContext(),
});

export const LOGIN_REQUEST = `${prefix}/LOGIN_REQUEST`;
export const LOGIN_SUCCESS = `${prefix}/LOGIN_SUCCESS`;
export const LOGIN_FAILURE = `${prefix}/LOGIN_FAILURE`;

export const login = ({ username, password, pin }) => ({
  types: [LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE],
  promise: api =>
    pin ? api.edge.loginPIN(username, pin) : api.edge.login(username, password),
});

export const CONFIRM_PIN_REQUEST = `${prefix}/CONFIRM_PIN_REQUEST`;
export const CONFIRM_PIN_SUCCESS = `${prefix}/CONFIRM_PIN_SUCCESS`;
export const CONFIRM_PIN_FAILURE = `${prefix}/CONFIRM_PIN_FAILURE`;

export const confirmPin = ({ username, pin }) => ({
  types: [CONFIRM_PIN_REQUEST, CONFIRM_PIN_SUCCESS, CONFIRM_PIN_FAILURE],
  promise: async api => {
    const account = await api.edge.loginPIN(username, pin);

    const keys = {};
    try {
      for (const walletId of account.activeWalletIds) {
        const wallet = await account.waitForCurrencyWallet(walletId);
        if (wallet.currencyInfo.currencyCode === 'FIO') {
          console.log('===========', wallet.keys);
          console.log('===========', wallet);
          keys[walletId] = {
            private: wallet.keys.private,
            public: wallet.publicWalletInfo.keys.publicKey,
          };
        }
      }
    } catch (e) {
      console.log(e);
    }

    return keys;
  },
});

export const SET_ACCOUNT = `${prefix}/SET_ACCOUNT`;

export const setAccount = account => ({
  type: SET_ACCOUNT,
  data: account,
});

export const REFRESH_FIO_WALLETS = `${prefix}/REFRESH_FIO_WALLETS`;
export const REFRESH_FIO_WALLETS_SUCCESS = `${prefix}/REFRESH_FIO_WALLETS_SUCCESS`;
export const REFRESH_FIO_WALLETS_FAILURE = `${prefix}/REFRESH_FIO_WALLETS_FAILURE`;

export const refreshFioWallets = account => ({
  types: [
    REFRESH_FIO_WALLETS,
    REFRESH_FIO_WALLETS_SUCCESS,
    REFRESH_FIO_WALLETS_FAILURE,
  ],
  promise: async () => {
    const fioWallets = [];
    try {
      for (const walletId of account.activeWalletIds) {
        const wallet = await account.waitForCurrencyWallet(walletId);
        if (wallet.currencyInfo.currencyCode === 'FIO') {
          fioWallets.push(wallet);
        }
      }
    } catch (e) {
      console.log(e);
    }

    return fioWallets;
  },
});

export const SIGNUP_REQUEST = `${prefix}/SIGNUP_REQUEST`;
export const SIGNUP_SUCCESS = `${prefix}/SIGNUP_SUCCESS`;
export const SIGNUP_FAILURE = `${prefix}/SIGNUP_FAILURE`;

export const signup = ({ username, password, repeatPassword, pin }) => ({
  types: [SIGNUP_REQUEST, SIGNUP_SUCCESS, SIGNUP_FAILURE],
  promise: api => api.edge.signup(username, password, repeatPassword, pin),
});

export const CACHED_USERS_REQUEST = `${prefix}/CACHED_USERS_REQUEST`;
export const CACHED_USERS_SUCCESS = `${prefix}/CACHED_USERS_SUCCESS`;
export const CACHED_USERS_FAILURE = `${prefix}/CACHED_USERS_FAILURE`;

export const getCachedUsers = () => ({
  types: [CACHED_USERS_REQUEST, CACHED_USERS_SUCCESS, CACHED_USERS_FAILURE],
  promise: api => api.edge.getCachedUsers(),
});

export const RECOVERY_QUEST_REQUEST = `${prefix}/RECOVERY_QUEST_REQUEST`;
export const RECOVERY_QUEST_SUCCESS = `${prefix}/RECOVERY_QUEST_SUCCESS`;
export const RECOVERY_QUEST_FAILURE = `${prefix}/RECOVERY_QUEST_FAILURE`;

export const getRecoveryQuestions = () => ({
  types: [
    RECOVERY_QUEST_REQUEST,
    RECOVERY_QUEST_SUCCESS,
    RECOVERY_QUEST_FAILURE,
  ],
  promise: api => api.edge.getRecoveryQuestions(),
});

export const USERNAME_AVAIL_REQUEST = `${prefix}/USERNAME_AVAIL_REQUEST`;
export const USERNAME_AVAIL_SUCCESS = `${prefix}/USERNAME_AVAIL_SUCCESS`;
export const USERNAME_AVAIL_FAILURE = `${prefix}/USERNAME_AVAIL_FAILURE`;

export const usernameAvailable = username => ({
  types: [
    USERNAME_AVAIL_REQUEST,
    USERNAME_AVAIL_SUCCESS,
    USERNAME_AVAIL_FAILURE,
  ],
  promise: api => api.edge.usernameAvailable(username),
});

// todo: check if it need
export const RESET_SUCCESS_STATE = `${prefix}/RESET_SUCCESS_STATE`;
export const resetSuccessState = () => ({
  type: RESET_SUCCESS_STATE,
});

export const LOGOUT_REQUEST = `${prefix}/LOGOUT_REQUEST`;
export const LOGOUT_SUCCESS = `${prefix}/LOGOUT_SUCCESS`;
export const LOGOUT_FAILURE = `${prefix}/LOGOUT_FAILURE`;

export const logout = account => {
  console.log('logout', account);
  if (!account) return { type: LOGOUT_FAILURE };
  return {
    types: [LOGOUT_REQUEST, LOGOUT_SUCCESS, LOGOUT_FAILURE],
    promise: () => account.logout(),
  };
};

export const CONFIRM_REQUEST = `${prefix}/CONFIRM_REQUEST`;
export const CONFIRM_SUCCESS = `${prefix}/CONFIRM_SUCCESS`;
export const CONFIRM_FAILURE = `${prefix}/CONFIRM_FAILURE`;

export const confirm = hash => ({
  types: [CONFIRM_REQUEST, CONFIRM_SUCCESS, CONFIRM_FAILURE],
  promise: api => api.edge.confirm(hash),
});

export const PASSWORD_RECOVERY_REQUEST = `${prefix}/PASSWORD_RECOVERY_REQUEST`;
export const PASSWORD_RECOVERY_SUCCESS = `${prefix}/PASSWORD_RECOVERY_SUCCESS`;
export const PASSWORD_RECOVERY_FAILURE = `${prefix}/PASSWORD_RECOVERY_FAILURE`;

export const passwordRecovery = ({ email }) => ({
  types: [
    PASSWORD_RECOVERY_REQUEST,
    PASSWORD_RECOVERY_SUCCESS,
    PASSWORD_RECOVERY_FAILURE,
  ],
  promise: api => api.edge.resetPassword(email),
});

export const RESET_PASSWORD_REQUEST = `${prefix}/RESET_PASSWORD_REQUEST`;
export const RESET_PASSWORD_SUCCESS = `${prefix}/RESET_PASSWORD_SUCCESS`;
export const RESET_PASSWORD_FAILURE = `${prefix}/RESET_PASSWORD_FAILURE`;

export const resetPassword = ({ hash, password, confirmPassword }) => ({
  types: [
    RESET_PASSWORD_REQUEST,
    RESET_PASSWORD_SUCCESS,
    RESET_PASSWORD_FAILURE,
  ],
  promise: api => api.edge.setPassword(hash, password, confirmPassword),
});
