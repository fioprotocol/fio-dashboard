import { EdgeAccount } from 'edge-core-js';

import { waitWalletKeys } from '../../util/edge';
import { log } from '../../util/general';
import { emailToUsername } from '../../utils';

import { Api } from '../../api';
import { AnyObject, EdgeWalletsKeys } from '../../types';
import { CommonAction, CommonPromiseAction } from '../types';

import {
  DEFAULT_WALLET_OPTIONS,
  FIO_WALLET_TYPE,
  WALLET_CREATED_FROM,
} from '../../constants/common';
import { DEFAULT_EDGE_WALLET_NAME, FIO_CHAIN_CODE } from '../../constants/fio';

export const prefix = 'edge';

export const EDGE_CONTEXT_INIT_REQUEST = `${prefix}/EDGE_CONTEXT_INIT_REQUEST`;
export const EDGE_CONTEXT_INIT_SUCCESS = `${prefix}/EDGE_CONTEXT_INIT_SUCCESS`;
export const EDGE_CONTEXT_INIT_FAILURE = `${prefix}/EDGE_CONTEXT_INIT_FAILURE`;

export const edgeContextInit = (): CommonPromiseAction => ({
  types: [
    EDGE_CONTEXT_INIT_REQUEST,
    EDGE_CONTEXT_INIT_SUCCESS,
    EDGE_CONTEXT_INIT_FAILURE,
  ],
  promise: (api: Api) => api.edge.makeEdgeContext(),
});

export const LOGIN_REQUEST = `${prefix}/LOGIN_REQUEST`;
export const LOGIN_SUCCESS = `${prefix}/LOGIN_SUCCESS`;
export const LOGIN_FAILURE = `${prefix}/LOGIN_FAILURE`;

export const login = ({
  email,
  username,
  password,
  pin,
  refCode,
  options,
  voucherId,
}: {
  email: string;
  username: string;
  password: string;
  pin: string;
  refCode?: string;
  options?: { otpKey?: string };
  voucherId?: string;
}): CommonPromiseAction => ({
  types: [LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE],
  promise: async (api: Api) => {
    let retrySignup = false;
    if (email && !username) {
      try {
        username = await api.auth.username(email);
      } catch (e) {
        username = '';
        if (
          e.code === 'AUTHENTICATION_FAILED' &&
          e.fields &&
          e.fields.email === 'INVALID'
        ) {
          username = emailToUsername(email);
          retrySignup = true;
        }
      }
    }
    const account = pin
      ? await api.edge.loginPIN(username, pin)
      : await api.edge.login(username, password, options);
    const fioWallets = [];
    try {
      let index = 1;
      for (const walletId of account.activeWalletIds) {
        const wallet = await account.waitForCurrencyWallet(walletId);

        if (wallet.currencyInfo.currencyCode === FIO_CHAIN_CODE) {
          if (wallet.name === DEFAULT_EDGE_WALLET_NAME) {
            await wallet.renameWallet(
              `${DEFAULT_WALLET_OPTIONS.name} ${index}`,
            );

            index++;
          }
          fioWallets.push(wallet);
        }
      }
    } catch (e) {
      log.error(e);
    }

    // Create user on our side if not exist
    if (retrySignup) {
      if (!fioWallets.length) {
        const fioWallet = await account.createCurrencyWallet(
          FIO_WALLET_TYPE,
          DEFAULT_WALLET_OPTIONS,
        );
        await fioWallet.renameWallet(DEFAULT_WALLET_OPTIONS.name);
        fioWallets.push(fioWallet);
      }
      await api.auth.signup({
        username,
        email,
        fioWallets: fioWallets.map(({ id, publicWalletInfo }) => ({
          id: '',
          edgeId: id,
          name: DEFAULT_WALLET_OPTIONS.name,
          publicKey: publicWalletInfo.keys.publicKey,
          from: WALLET_CREATED_FROM.EDGE,
        })),
        refCode,
        addEmailToPromoList: true,
      });
    }

    return {
      account,
      email,
      fioWallets,
      options,
      voucherId,
      isPinLogin: !!pin,
    };
  },
});

export const CONFIRM_PIN_REQUEST = `${prefix}/CONFIRM_PIN_REQUEST`;
export const CONFIRM_PIN_SUCCESS = `${prefix}/CONFIRM_PIN_SUCCESS`;
export const CONFIRM_PIN_FAILURE = `${prefix}/CONFIRM_PIN_FAILURE`;

export const confirmPin = (
  {
    username,
    pin,
    password,
  }: { username: string; pin?: string; password?: string },
  { action, data }: { action: string; data: AnyObject },
): CommonPromiseAction => ({
  types: [CONFIRM_PIN_REQUEST, CONFIRM_PIN_SUCCESS, CONFIRM_PIN_FAILURE],
  promise: async (api: Api) => {
    const account = pin
      ? await api.edge.loginPIN(username, pin)
      : await api.edge.login(username, password);

    const keys: EdgeWalletsKeys = await waitWalletKeys(account);

    return { account, keys, action, data };
  },
});
export const RESET_PIN_CONFIRM = `${prefix}/RESET_PIN_CONFIRM`;
export const resetPinConfirm = (): CommonAction => ({
  type: RESET_PIN_CONFIRM,
});

export const RESET_LOGIN_FAILURE = `${prefix}/RESET_LOGIN_FAILURE`;
export const resetLoginFailure = (): CommonAction => ({
  type: RESET_LOGIN_FAILURE,
});

export const SET_ACCOUNT = `${prefix}/SET_ACCOUNT`;

export const setAccount = (account: EdgeAccount): CommonAction => ({
  type: SET_ACCOUNT,
  data: account,
});

export const SIGNUP_REQUEST = `${prefix}/SIGNUP_REQUEST`;
export const SIGNUP_SUCCESS = `${prefix}/SIGNUP_SUCCESS`;
export const SIGNUP_FAILURE = `${prefix}/SIGNUP_FAILURE`;

export const signup = ({
  username,
  password,
}: {
  username: string;
  password: string;
}): CommonPromiseAction => ({
  types: [SIGNUP_REQUEST, SIGNUP_SUCCESS, SIGNUP_FAILURE],
  promise: (api: Api) => api.edge.signup(username, password),
  username,
});

export const CACHED_USERS_REQUEST = `${prefix}/CACHED_USERS_REQUEST`;
export const CACHED_USERS_SUCCESS = `${prefix}/CACHED_USERS_SUCCESS`;
export const CACHED_USERS_FAILURE = `${prefix}/CACHED_USERS_FAILURE`;

export const getCachedUsers = (): CommonPromiseAction => ({
  types: [CACHED_USERS_REQUEST, CACHED_USERS_SUCCESS, CACHED_USERS_FAILURE],
  promise: (api: Api) => api.edge.getCachedUsers(),
});

export const RECOVERY_QUEST_REQUEST = `${prefix}/RECOVERY_QUEST_REQUEST`;
export const RECOVERY_QUEST_SUCCESS = `${prefix}/RECOVERY_QUEST_SUCCESS`;
export const RECOVERY_QUEST_FAILURE = `${prefix}/RECOVERY_QUEST_FAILURE`;

export const getRecoveryQuestions = (): CommonPromiseAction => ({
  types: [
    RECOVERY_QUEST_REQUEST,
    RECOVERY_QUEST_SUCCESS,
    RECOVERY_QUEST_FAILURE,
  ],
  promise: (api: Api) => api.edge.getRecoveryQuestions(),
});

export const USERNAME_AVAIL_REQUEST = `${prefix}/USERNAME_AVAIL_REQUEST`;
export const USERNAME_AVAIL_SUCCESS = `${prefix}/USERNAME_AVAIL_SUCCESS`;
export const USERNAME_AVAIL_FAILURE = `${prefix}/USERNAME_AVAIL_FAILURE`;

export const usernameAvailable = (username: string): CommonPromiseAction => ({
  types: [
    USERNAME_AVAIL_REQUEST,
    USERNAME_AVAIL_SUCCESS,
    USERNAME_AVAIL_FAILURE,
  ],
  promise: (api: Api) => api.edge.usernameAvailable(username),
});

// todo: check if it need
export const RESET_SUCCESS_STATE = `${prefix}/RESET_SUCCESS_STATE`;
export const resetSuccessState = (): CommonAction => ({
  type: RESET_SUCCESS_STATE,
});

export const LOGOUT_REQUEST = `${prefix}/LOGOUT_REQUEST`;
export const LOGOUT_SUCCESS = `${prefix}/LOGOUT_SUCCESS`;
export const LOGOUT_FAILURE = `${prefix}/LOGOUT_FAILURE`;

export const logout = (
  account: EdgeAccount,
): CommonPromiseAction | CommonAction => {
  if (!account) return { type: LOGOUT_FAILURE };
  return {
    types: [LOGOUT_REQUEST, LOGOUT_SUCCESS, LOGOUT_FAILURE],
    promise: () => account.logout(),
  };
};

export const CHANGE_PASSWORD_REQUEST = `${prefix}/CHANGE_PASSWORD_REQUEST`;
export const CHANGE_PASSWORD_SUCCESS = `${prefix}/CHANGE_PASSWORD_SUCCESS`;
export const CHANGE_PASSWORD_FAILURE = `${prefix}/CHANGE_PASSWORD_FAILURE`;

export const changePassword = ({
  password,
  newPassword,
  username,
}: {
  password: string;
  newPassword: string;
  username: string;
}): CommonPromiseAction => ({
  types: [
    CHANGE_PASSWORD_REQUEST,
    CHANGE_PASSWORD_SUCCESS,
    CHANGE_PASSWORD_FAILURE,
  ],
  promise: (api: Api) =>
    api.edge.changePassword(password, newPassword, username),
});

export const CLEAR_CHANGE_PASSWORD_RESULTS = `${prefix}/CLEAR_CHANGE_PASSWORD_RESULTS`;
export const clearChangePasswordResults = (): CommonAction => ({
  type: CLEAR_CHANGE_PASSWORD_RESULTS,
});

export const CLEAR_CHANGE_PASSWORD_ERROR = `${prefix}/CLEAR_CHANGE_PASSWORD_ERROR`;
export const clearChangePasswordError = (): CommonAction => ({
  type: CLEAR_CHANGE_PASSWORD_ERROR,
});

export const CHANGE_PIN_REQUEST = `${prefix}/CHANGE_PIN_REQUEST`;
export const CHANGE_PIN_SUCCESS = `${prefix}/CHANGE_PIN_SUCCESS`;
export const CHANGE_PIN_FAILURE = `${prefix}/CHANGE_PIN_FAILURE`;

export const changePin = ({
  pin,
  password,
  username,
}: {
  pin: string;
  password: string;
  username: string;
}): CommonPromiseAction => ({
  types: [CHANGE_PIN_REQUEST, CHANGE_PIN_SUCCESS, CHANGE_PIN_FAILURE],
  promise: (api: Api) => api.edge.changePin(pin, password, username),
  username,
});

export const CLEAR_CHANGE_PIN_RESULTS = `${prefix}/CLEAR_CHANGE_PIN_RESULTS`;
export const clearChangePinResults = (): CommonAction => ({
  type: CLEAR_CHANGE_PIN_RESULTS,
});

export const CLEAR_CHANGE_PIN_ERROR = `${prefix}/CLEAR_CHANGE_PIN_ERROR`;
export const clearChangePinError = (): CommonAction => ({
  type: CLEAR_CHANGE_PIN_ERROR,
});

export const CLEAR_CACHED_USERS_REQUEST = `${prefix}/CLEAR_CACHED_USERS_REQUEST`;
export const CLEAR_CACHED_USERS_SUCCESS = `${prefix}/CLEAR_CACHED_USERS_SUCCESS`;
export const CLEAR_CACHED_USERS_FAILURE = `${prefix}/CLEAR_CACHED_USERS_FAILURE`;
export const clearCachedUser = (username: string): CommonPromiseAction => ({
  types: [
    CLEAR_CACHED_USERS_REQUEST,
    CLEAR_CACHED_USERS_SUCCESS,
    CLEAR_CACHED_USERS_FAILURE,
  ],
  promise: (api: Api) => api.edge.clearCachedUser(username),
});

export const CHANGE_RECOVERY_QUESTIONS_OPEN = `${prefix}/CHANGE_RECOVERY_QUESTIONS_OPEN`;
export const changeRecoveryQuestionsOpen = (): CommonAction => ({
  type: CHANGE_RECOVERY_QUESTIONS_OPEN,
});

export const CHANGE_RECOVERY_QUESTIONS_CLOSE = `${prefix}/CHANGE_RECOVERY_QUESTIONS_CLOSE`;
export const changeRecoveryQuestionsClose = (): CommonAction => ({
  type: CHANGE_RECOVERY_QUESTIONS_CLOSE,
});

export const CHECK_RECOVERY_QUESTIONS_REQUEST = `${prefix}/CHECK_RECOVERY_QUESTIONS_REQUEST`;
export const CHECK_RECOVERY_QUESTIONS_SUCCESS = `${prefix}/CHECK_RECOVERY_QUESTIONS_SUCCESS`;
export const CHECK_RECOVERY_QUESTIONS_FAILURE = `${prefix}/CHECK_RECOVERY_QUESTIONS_FAILURE`;

export const checkRecoveryQuestions = (
  username: string,
): CommonPromiseAction => ({
  types: [
    CHECK_RECOVERY_QUESTIONS_REQUEST,
    CHECK_RECOVERY_QUESTIONS_SUCCESS,
    CHECK_RECOVERY_QUESTIONS_FAILURE,
  ],
  promise: (api: Api) => api.edge.checkRecoveryQuestions(username),
});

export const GET_USERS_RECOVERY_QUESTIONS_REQUEST = `${prefix}/GET_USERS_RECOVERY_QUESTIONS_REQUEST`;
export const GET_USERS_RECOVERY_QUESTIONS_SUCCESS = `${prefix}/GET_USERS_RECOVERY_QUESTIONS_SUCCESS`;
export const GET_USERS_RECOVERY_QUESTIONS_FAILURE = `${prefix}/GET_USERS_RECOVERY_QUESTIONS_FAILURE`;

export const getUsersRecoveryQuestions = (
  token: string,
  username: string,
): CommonPromiseAction => ({
  types: [
    GET_USERS_RECOVERY_QUESTIONS_REQUEST,
    GET_USERS_RECOVERY_QUESTIONS_SUCCESS,
    GET_USERS_RECOVERY_QUESTIONS_FAILURE,
  ],
  promise: (api: Api) => api.edge.getUsersRecoveryQuestions(token, username),
});

export const RECOVERY_ACCOUNT_REQUEST = `${prefix}/RECOVERY_ACCOUNT_REQUEST`;
export const RECOVERY_ACCOUNT_SUCCESS = `${prefix}/RECOVERY_ACCOUNT_SUCCESS`;
export const RECOVERY_ACCOUNT_FAILURE = `${prefix}/RECOVERY_ACCOUNT_FAILURE`;

export const recoveryAccount = ({
  token,
  username,
  answers,
  password,
}: {
  token: string;
  username: string;
  answers: string[];
  password: string;
}): CommonPromiseAction => ({
  types: [
    RECOVERY_ACCOUNT_REQUEST,
    RECOVERY_ACCOUNT_SUCCESS,
    RECOVERY_ACCOUNT_FAILURE,
  ],
  promise: (api: Api) =>
    api.edge.recoveryAccount(token, username, answers, password),
});

export const CLEAR_RECOVERY_RESULTS = `${prefix}/CLEAR_RECOVERY_RESULTS`;

export const clearRecoveryResults = (): CommonAction => ({
  type: CLEAR_RECOVERY_RESULTS,
});

export const TOGGLE_TWO_FACTOR_AUTH = `${prefix}/TOGGLE_TWO_FACTOR_AUTH`;

export const toggleTwoFactorAuth = (enabled: boolean): CommonAction => ({
  type: TOGGLE_TWO_FACTOR_AUTH,
  enabled,
});

export const SET_CONFIRM_PIN_KEYS = `${prefix}/SET_CONFIRM_PIN_KEYS`;
export const setConfirmPinKeys = (
  keys: EdgeWalletsKeys | null,
): CommonAction => ({
  type: SET_CONFIRM_PIN_KEYS,
  data: keys,
});

export const SET_IS_PIN_ENABLED_REQUEST = `${prefix}/SET_IS_PIN_ENABLED_REQUEST`;
export const SET_IS_PIN_ENABLED_SUCCESS = `${prefix}/SET_IS_PIN_ENABLED_SUCCESS`;
export const SET_IS_PIN_ENABLED_FAILURE = `${prefix}/SET_IS_PIN_ENABLED_FAILURE`;

export const setPinEnabled = (username: string): CommonPromiseAction => ({
  types: [
    SET_IS_PIN_ENABLED_REQUEST,
    SET_IS_PIN_ENABLED_SUCCESS,
    SET_IS_PIN_ENABLED_FAILURE,
  ],
  promise: (api: Api) => api.edge.checkIsPinSet(username),
});

export const SET_IS_PIN_POSTPONED = `${prefix}/SET_IS_PIN_POSTPONED_SUCCESS`;

export const setPinSetupPostponed = (
  isPinPostponed: boolean,
): CommonAction => ({
  type: SET_IS_PIN_POSTPONED,
  data: isPinPostponed,
});
