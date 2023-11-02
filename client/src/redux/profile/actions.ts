import { Ecc } from '@fioprotocol/fiojs';

import { RouterProps } from 'react-router';

import { Api } from '../../api';
import { FioWalletDoublet, WalletKeysObj } from '../../types';
import { minWaitTimeFunction } from '../../utils';

import { GetState } from '../init';
import { CommonAction, CommonPromiseAction } from '../types';

export const prefix = 'profile';

export const AUTH_CHECK_REQUEST = `${prefix}/AUTH_CHECK_REQUEST`;
export const AUTH_CHECK_SUCCESS = `${prefix}/AUTH_CHECK_SUCCESS`;
export const AUTH_CHECK_FAILURE = `${prefix}/AUTH_CHECK_FAILURE`;

export const checkAuthToken = (): CommonPromiseAction => ({
  types: [AUTH_CHECK_REQUEST, AUTH_CHECK_SUCCESS, AUTH_CHECK_FAILURE],
  promise: (api: Api) => api.auth.profile(),
});

export const PROFILE_REQUEST = `${prefix}/PROFILE_REQUEST`;
export const PROFILE_SUCCESS = `${prefix}/PROFILE_SUCCESS`;
export const PROFILE_FAILURE = `${prefix}/PROFILE_FAILURE`;

export const loadProfile = ({
  shouldHandleUsersFreeCart,
}: {
  shouldHandleUsersFreeCart?: boolean;
}): CommonPromiseAction => ({
  types: [PROFILE_REQUEST, PROFILE_SUCCESS, PROFILE_FAILURE],
  promise: (api: Api) => api.auth.profile(),
  shouldHandleUsersFreeCart,
});

export const NONCE_REQUEST = `${prefix}/NONCE_REQUEST`;
export const NONCE_SUCCESS = `${prefix}/NONCE_SUCCESS`;
export const NONCE_FAILURE = `${prefix}/NONCE_FAILURE`;

export const makeNonce = (
  username: string,
  keys: WalletKeysObj,
  otpKey?: string,
  voucherId?: string,
  isPinLogin?: boolean,
  isSignUp?: boolean,
): CommonPromiseAction => ({
  types: [NONCE_REQUEST, NONCE_SUCCESS, NONCE_FAILURE],
  promise: async (api: Api) => {
    const { nonce, email } = await api.auth.nonce(username);
    const signature: string = Ecc.sign(nonce, Object.values(keys)[0].private);
    return { email, nonce, signature, otpKey, voucherId, isPinLogin, isSignUp };
  },
});

export const LOGIN_REQUEST = `${prefix}/LOGIN_REQUEST`;
export const LOGIN_SUCCESS = `${prefix}/LOGIN_SUCCESS`;
export const LOGIN_FAILURE = `${prefix}/LOGIN_FAILURE`;

export const login = ({
  email,
  signature,
  challenge,
  referrerCode,
  timeZone,
  otpKey,
  voucherId,
  isPinLogin,
  isSignUp,
}: {
  email: string;
  signature: string;
  challenge: string;
  referrerCode?: string;
  timeZone?: string;
  otpKey?: string;
  voucherId?: string;
  isPinLogin?: boolean;
  isSignUp?: boolean;
}): CommonPromiseAction => ({
  types: [LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE],
  promise: (api: Api) =>
    api.auth.login(email, signature, challenge, referrerCode, timeZone),
  otpKey,
  voucherId,
  isPinLogin,
  isSignUp,
});

export const SIGNUP_REQUEST = `${prefix}/SIGNUP_REQUEST`;
export const SIGNUP_SUCCESS = `${prefix}/SIGNUP_SUCCESS`;
export const SIGNUP_FAILURE = `${prefix}/SIGNUP_FAILURE`;
export const RESET_SUCCESS_STATE = `${prefix}/RESET_SUCCESS_STATE`;

export const signup = (data: {
  username: string;
  email: string;
  fioWallets: FioWalletDoublet[];
  refCode?: string;
  addEmailToPromoList: boolean;
}): CommonPromiseAction => ({
  types: [SIGNUP_REQUEST, SIGNUP_SUCCESS, SIGNUP_FAILURE],
  promise: (api: Api) => api.auth.signup(data),
  fioWallets: data.fioWallets,
});

export const resetSuccessState = (): CommonAction => ({
  type: RESET_SUCCESS_STATE,
});

export const LOGOUT_REQUEST = `${prefix}/LOGOUT_REQUEST`;
export const LOGOUT_SUCCESS = `${prefix}/LOGOUT_SUCCESS`;
export const LOGOUT_FAILURE = `${prefix}/LOGOUT_FAILURE`;

export const logout = (
  { history }: RouterProps,
  redirect: string = '',
): CommonPromiseAction => ({
  types: [LOGOUT_REQUEST, LOGOUT_SUCCESS, LOGOUT_FAILURE],
  promise: (api: Api) => api.auth.logout(),
  redirect,
});

export const SET_RECOVERY_REQUEST = `${prefix}/SET_RECOVERY_REQUEST`;
export const SET_RECOVERY_SUCCESS = `${prefix}/SET_RECOVERY_SUCCESS`;
export const SET_RECOVERY_FAILURE = `${prefix}/SET_RECOVERY_FAILURE`;

export const setRecoveryQuestions = (token: string): CommonPromiseAction => ({
  types: [SET_RECOVERY_REQUEST, SET_RECOVERY_SUCCESS, SET_RECOVERY_FAILURE],
  promise: async (api: Api) =>
    minWaitTimeFunction(() => api.auth.setRecovery(token), 4000),
});

export const RESET_LAST_AUTH_DATA_REQUEST = `${prefix}/RESET_LAST_AUTH_DATA_REQUEST`;
export const RESET_LAST_AUTH_DATA_SUCCESS = `${prefix}/RESET_LAST_AUTH_DATA_SUCCESS`;
export const RESET_LAST_AUTH_DATA_FAILURE = `${prefix}/RESET_LAST_AUTH_DATA_FAILURE`;

export const resetLastAuthData = (): CommonPromiseAction => ({
  types: [
    RESET_LAST_AUTH_DATA_REQUEST,
    RESET_LAST_AUTH_DATA_SUCCESS,
    RESET_LAST_AUTH_DATA_FAILURE,
  ],
  promise: async (api: Api, getState: GetState) => {
    const { profile, edge } = getState();

    if (!profile.lastAuthData || edge.hasTwoFactorAuth) return;

    return api.edge.clearCachedUser(profile.lastAuthData.username);
  },
});

export const SECONDS_SINCE_LAST_ACTIVITY = `${prefix}/SECONDS_SINCE_LAST_ACTIVITY`;

export const setLastActivity = (value: number): CommonAction => ({
  type: SECONDS_SINCE_LAST_ACTIVITY,
  data: value,
});

export const ADMIN_LOGIN_REQUEST = `${prefix}/ADMIN_LOGIN_REQUEST`;
export const ADMIN_LOGIN_SUCCESS = `${prefix}/ADMIN_LOGIN_SUCCESS`;
export const ADMIN_LOGIN_FAILURE = `${prefix}/ADMIN_LOGIN_FAILURE`;

export const ADMIN_LOGOUT_REQUEST = `${prefix}/ADMIN_LOGOUT_REQUEST`;
export const ADMIN_LOGOUT_SUCCESS = `${prefix}/ADMIN_LOGOUT_SUCCESS`;
export const ADMIN_LOGOUT_FAILURE = `${prefix}/ADMIN_LOGOUT_FAILURE`;

export const adminLogout = (
  { history }: RouterProps,
  redirect: string = '',
): CommonPromiseAction => ({
  types: [ADMIN_LOGOUT_REQUEST, ADMIN_LOGOUT_SUCCESS, ADMIN_LOGOUT_FAILURE],
  promise: (api: Api) => api.auth.adminLogout(),
  redirect,
});

export const adminLogin = ({
  email,
  password,
  tfaToken,
}: {
  email: string;
  password: string;
  tfaToken: string;
}): CommonPromiseAction => ({
  types: [ADMIN_LOGIN_REQUEST, ADMIN_LOGIN_SUCCESS, ADMIN_LOGIN_FAILURE],
  promise: (api: Api) => api.auth.adminLogin(email, password, tfaToken),
});

export const ADMIN_PROFILE_REQUEST = `${prefix}/ADMIN_PROFILE_REQUEST`;
export const ADMIN_PROFILE_SUCCESS = `${prefix}/ADMIN_PROFILE_SUCCESS`;
export const ADMIN_PROFILE_FAILURE = `${prefix}/ADMIN_PROFILE_FAILURE`;

export const loadAdminProfile = (): CommonPromiseAction => ({
  types: [ADMIN_PROFILE_REQUEST, ADMIN_PROFILE_SUCCESS, ADMIN_PROFILE_FAILURE],
  promise: (api: Api) => api.auth.adminProfile(),
});

export const CONFIRM_ADMIN_EMAIL_REQUEST = `${prefix}/CONFIRM_ADMIN_EMAIL_REQUEST`;
export const CONFIRM_ADMIN_EMAIL_SUCCESS = `${prefix}/CONFIRM_ADMIN_EMAIL_SUCCESS`;
export const CONFIRM_ADMIN_EMAIL_FAILURE = `${prefix}/CONFIRM_ADMIN_EMAIL_FAILURE`;

export const confirmAdminEmail = (values: {
  email: string;
  hash: string;
  password: string;
  tfaToken: string;
  tfaSecret: string;
}): CommonPromiseAction => ({
  types: [
    CONFIRM_ADMIN_EMAIL_REQUEST,
    CONFIRM_ADMIN_EMAIL_SUCCESS,
    CONFIRM_ADMIN_EMAIL_FAILURE,
  ],
  promise: (api: Api) => api.auth.confirmAdminByEmail(values),
});

export const RESET_ADMIN_PASSWORD_REQUEST = `${prefix}/RESET_ADMIN_PASSWORD_REQUEST`;
export const RESET_ADMIN_PASSWORD_SUCCESS = `${prefix}/RESET_ADMIN_PASSWORD_SUCCESS`;
export const RESET_ADMIN_PASSWORD_FAILURE = `${prefix}/RESET_ADMIN_PASSWORD_FAILURE`;

export const resetAdminPassword = (values: {
  email: string;
  hash: string;
  password: string;
}): CommonPromiseAction => ({
  types: [
    RESET_ADMIN_PASSWORD_REQUEST,
    RESET_ADMIN_PASSWORD_SUCCESS,
    RESET_ADMIN_PASSWORD_FAILURE,
  ],
  promise: (api: Api) => api.auth.resetAdminPassword(values),
});

export const ACTIVATE_AFFILIATE_REQUEST = `${prefix}/ACTIVATE_AFFILIATE_REQUEST`;
export const ACTIVATE_AFFILIATE_SUCCESS = `${prefix}/ACTIVATE_AFFILIATE_SUCCESS`;
export const ACTIVATE_AFFILIATE_FAILURE = `${prefix}/ACTIVATE_AFFILIATE_FAILURE`;

export const activateAffiliate = (fch: string): CommonPromiseAction => ({
  types: [
    ACTIVATE_AFFILIATE_REQUEST,
    ACTIVATE_AFFILIATE_SUCCESS,
    ACTIVATE_AFFILIATE_FAILURE,
  ],
  promise: (api: Api) => api.auth.activateAffiliate(fch),
});

export const UPDATE_AFFILIATE_REQUEST = `${prefix}/UPDATE_AFFILIATE_REQUEST`;
export const UPDATE_AFFILIATE_SUCCESS = `${prefix}/UPDATE_AFFILIATE_SUCCESS`;
export const UPDATE_AFFILIATE_FAILURE = `${prefix}/UPDATE_AFFILIATE_FAILURE`;

export const updateAffiliate = (fch: string): CommonPromiseAction => ({
  types: [
    UPDATE_AFFILIATE_REQUEST,
    UPDATE_AFFILIATE_SUCCESS,
    UPDATE_AFFILIATE_FAILURE,
  ],
  promise: (api: Api) => api.auth.updateAffiliate(fch),
});

export const SET_IS_NEW_USER = `${prefix}/SET_IS_NEW_USER`;

export const setIsNewUser = (isNewUser: boolean): CommonAction => ({
  type: SET_IS_NEW_USER,
  isNewUser,
});
