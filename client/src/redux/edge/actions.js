import { DEFAULT_WALLET_OPTIONS } from '../../constants/common';

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

export const login = ({ email, username, password, pin }) => ({
  types: [LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE],
  promise: async api => {
    if (email && !username) {
      try {
        username = await api.auth.username(email);
      } catch (e) {
        username = '';
      }
    }
    const account = pin
      ? await api.edge.loginPIN(username, pin)
      : await api.edge.login(username, password);
    const fioWallets = [];
    try {
      for (const walletId of account.activeWalletIds) {
        const wallet = await account.waitForCurrencyWallet(walletId);

        // todo: investigate why wallet name changes
        if (wallet.name === 'io.fioprotocol.app')
          await wallet.renameWallet(DEFAULT_WALLET_OPTIONS.name);

        if (wallet.currencyInfo.currencyCode === 'FIO') {
          fioWallets.push(wallet);
        }
      }
    } catch (e) {
      console.log(e);
    }
    return { account, fioWallets };
  },
});

export const CONFIRM_PIN_REQUEST = `${prefix}/CONFIRM_PIN_REQUEST`;
export const CONFIRM_PIN_SUCCESS = `${prefix}/CONFIRM_PIN_SUCCESS`;
export const CONFIRM_PIN_FAILURE = `${prefix}/CONFIRM_PIN_FAILURE`;

export const confirmPin = ({ username, pin }, { action, data }) => ({
  types: [CONFIRM_PIN_REQUEST, CONFIRM_PIN_SUCCESS, CONFIRM_PIN_FAILURE],
  promise: async api => {
    const account = await api.edge.loginPIN(username, pin);

    const keys = {};
    try {
      for (const walletId of account.activeWalletIds) {
        const wallet = await account.waitForCurrencyWallet(walletId);
        if (wallet.currencyInfo.currencyCode === 'FIO') {
          keys[walletId] = {
            private: wallet.keys.fioKey,
            public: wallet.publicWalletInfo.keys.publicKey,
          };
          await wallet.stopEngine();
        }
      }
    } catch (e) {
      console.log(e);
    }

    return { account, keys, action, data };
  },
});
export const RESET_PIN_CONFIRM = `${prefix}/RESET_PIN_CONFIRM`;
export const resetPinConfirm = () => ({
  type: RESET_PIN_CONFIRM,
});

export const SET_ACCOUNT = `${prefix}/SET_ACCOUNT`;

export const setAccount = account => ({
  type: SET_ACCOUNT,
  data: account,
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

export const CHANGE_PASSWORD_REQUEST = `${prefix}/CHANGE_PASSWORD_REQUEST`;
export const CHANGE_PASSWORD_SUCCESS = `${prefix}/CHANGE_PASSWORD_SUCCESS`;
export const CHANGE_PASSWORD_FAILURE = `${prefix}/CHANGE_PASSWORD_FAILURE`;

export const changePassword = ({ password, newPassword, username }) => ({
  types: [
    CHANGE_PASSWORD_REQUEST,
    CHANGE_PASSWORD_SUCCESS,
    CHANGE_PASSWORD_FAILURE,
  ],
  promise: api => api.edge.changePassword(password, newPassword, username),
});

export const CLEAR_CHANGE_PASSWORD_RESULTS = `${prefix}/CLEAR_CHANGE_PASSWORD_RESULTS`;
export const clearChangePasswordResults = () => ({
  type: CLEAR_CHANGE_PASSWORD_RESULTS,
});

export const CLEAR_CHANGE_PASSWORD_ERROR = `${prefix}/CLEAR_CHANGE_PASSWORD_ERROR`;
export const clearChangePasswordError = () => ({
  type: CLEAR_CHANGE_PASSWORD_ERROR,
});

export const CHANGE_PIN_REQUEST = `${prefix}/CHANGE_PIN_REQUEST`;
export const CHANGE_PIN_SUCCESS = `${prefix}/CHANGE_PIN_SUCCESS`;
export const CHANGE_PIN_FAILURE = `${prefix}/CHANGE_PIN_FAILURE`;

export const changePin = ({ pin, password, username }) => ({
  types: [CHANGE_PIN_REQUEST, CHANGE_PIN_SUCCESS, CHANGE_PIN_FAILURE],
  promise: api => api.edge.changePin(pin, password, username),
});

export const CLEAR_CHANGE_PIN_RESULTS = `${prefix}/CLEAR_CHANGE_PIN_RESULTS`;
export const clearChangePinResults = () => ({
  type: CLEAR_CHANGE_PIN_RESULTS,
});

export const CLEAR_CHANGE_PIN_ERROR = `${prefix}/CLEAR_CHANGE_PIN_ERROR`;
export const clearChangePinError = () => ({
  type: CLEAR_CHANGE_PIN_ERROR,
});

export const CLEAR_CACHED_USERS_REQUEST = `${prefix}/CLEAR_CACHED_USERS_REQUEST`;
export const CLEAR_CACHED_USERS_SUCCESS = `${prefix}/CLEAR_CACHED_USERS_SUCCESS`;
export const CLEAR_CACHED_USERS_FAILURE = `${prefix}/CLEAR_CACHED_USERS_FAILURE`;
export const clearCachedUser = username => ({
  types: [
    CLEAR_CACHED_USERS_REQUEST,
    CLEAR_CACHED_USERS_SUCCESS,
    CLEAR_CACHED_USERS_FAILURE,
  ],
  promise: api => api.edge.clearCachedUser(username),
});

export const CHANGE_RECOVERY_QUESTIONS_OPEN = `${prefix}/CHANGE_RECOVERY_QUESTIONS_OPEN`;
export const changeRecoveryQuestionsOpen = () => ({
  type: CHANGE_RECOVERY_QUESTIONS_OPEN,
});

export const CHANGE_RECOVERY_QUESTIONS_CLOSE = `${prefix}/CHANGE_RECOVERY_QUESTIONS_CLOSE`;
export const changeRecoveryQuestionsClose = () => ({
  type: CHANGE_RECOVERY_QUESTIONS_CLOSE,
});

export const CHECK_RECOVERY_QUESTIONS_REQUEST = `${prefix}/CHECK_RECOVERY_QUESTIONS_REQUEST`;
export const CHECK_RECOVERY_QUESTIONS_SUCCESS = `${prefix}/CHECK_RECOVERY_QUESTIONS_SUCCESS`;
export const CHECK_RECOVERY_QUESTIONS_FAILURE = `${prefix}/CHECK_RECOVERY_QUESTIONS_FAILURE`;

export const checkRecoveryQuestions = username => ({
  types: [
    CHECK_RECOVERY_QUESTIONS_REQUEST,
    CHECK_RECOVERY_QUESTIONS_SUCCESS,
    CHECK_RECOVERY_QUESTIONS_FAILURE,
  ],
  promise: api => api.edge.checkRecoveryQuestions(username),
});

export const GET_USERS_RECOVERY_QUESTIONS_REQUEST = `${prefix}/GET_USERS_RECOVERY_QUESTIONS_REQUEST`;
export const GET_USERS_RECOVERY_QUESTIONS_SUCCESS = `${prefix}/GET_USERS_RECOVERY_QUESTIONS_SUCCESS`;
export const GET_USERS_RECOVERY_QUESTIONS_FAILURE = `${prefix}/GET_USERS_RECOVERY_QUESTIONS_FAILURE`;

export const getUsersRecoveryQuestions = (token, username) => ({
  types: [
    GET_USERS_RECOVERY_QUESTIONS_REQUEST,
    GET_USERS_RECOVERY_QUESTIONS_SUCCESS,
    GET_USERS_RECOVERY_QUESTIONS_FAILURE,
  ],
  promise: api => api.edge.getUsersRecoveryQuestions(token, username),
});

export const RECOVERY_ACCOUNT_REQUEST = `${prefix}/RECOVERY_ACCOUNT_REQUEST`;
export const RECOVERY_ACCOUNT_SUCCESS = `${prefix}/RECOVERY_ACCOUNT_SUCCESS`;
export const RECOVERY_ACCOUNT_FAILURE = `${prefix}/RECOVERY_ACCOUNT_FAILURE`;

export const recoveryAccount = ({ token, username, answers, password }) => ({
  types: [
    RECOVERY_ACCOUNT_REQUEST,
    RECOVERY_ACCOUNT_SUCCESS,
    RECOVERY_ACCOUNT_FAILURE,
  ],
  promise: api => api.edge.recoveryAccount(token, username, answers, password),
});

export const CLEAR_RECOVERY_RESULTS = `${prefix}/CLEAR_RECOVERY_RESULTS`;

export const clearRecoveryResults = () => ({
  type: CLEAR_RECOVERY_RESULTS,
});

export const DISABLE_RECOVERY_PASSWORD_REQUEST = `${prefix}/DISABLE_RECOVERY_PASSWORD_REQUEST`;
export const DISABLE_RECOVERY_PASSWORD_SUCCESS = `${prefix}/DISABLE_RECOVERY_PASSWORD_SUCCESS`;
export const DISABLE_RECOVERY_PASSWORD_FAILURE = `${prefix}/DISABLE_RECOVERY_PASSWORD_FAILURE`;

export const disableRecoveryPassword = account => ({
  types: [
    DISABLE_RECOVERY_PASSWORD_REQUEST,
    DISABLE_RECOVERY_PASSWORD_SUCCESS,
    DISABLE_RECOVERY_PASSWORD_FAILURE,
  ],
  promise: api => api.edge.disableRecovery(account),
});

export const CLEAR_DISABLE_RECOVERY_PASSWORD_RESULTS = `${prefix}/CLEAR_DISABLE_RECOVERY_PASSWORD_RESULTS`;
export const clearDisableRecoveryResults = () => ({
  type: CLEAR_DISABLE_RECOVERY_PASSWORD_RESULTS,
});
