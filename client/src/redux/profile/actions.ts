import { Ecc } from '@fioprotocol/fiojs';

import { RouterProps } from 'react-router';

import { Api } from '../../api';
import {
  EmailConfirmationStateData,
  FioWalletDoublet,
  WalletKeysObj,
} from '../../types';
import { minWaitTimeFunction } from '../../utils';

import { GetState } from '../init';
import { ROUTES } from '../../constants/routes';
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

export const loadProfile = (): CommonPromiseAction => ({
  types: [PROFILE_REQUEST, PROFILE_SUCCESS, PROFILE_FAILURE],
  promise: (api: Api) => api.auth.profile(),
});

export const NONCE_REQUEST = `${prefix}/NONCE_REQUEST`;
export const NONCE_SUCCESS = `${prefix}/NONCE_SUCCESS`;
export const NONCE_FAILURE = `${prefix}/NONCE_FAILURE`;

export const makeNonce = (
  username: string,
  keys: WalletKeysObj,
  otpKey?: string,
  voucherId?: string,
): CommonPromiseAction => ({
  types: [NONCE_REQUEST, NONCE_SUCCESS, NONCE_FAILURE],
  promise: async (api: Api) => {
    const { nonce, email } = await api.auth.nonce(username);
    const signature: string = Ecc.sign(nonce, Object.values(keys)[0].private);
    return { email, nonce, signature, otpKey, voucherId };
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
  otpKey,
  voucherId,
}: {
  email: string;
  signature: string;
  challenge: string;
  referrerCode?: string;
  otpKey?: string;
  voucherId?: string;
}): CommonPromiseAction => ({
  types: [LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE],
  promise: (api: Api) =>
    api.auth.login(email, signature, challenge, referrerCode),
  otpKey,
  voucherId,
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
  stateData?: EmailConfirmationStateData;
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
  promise: async (api: Api) => {
    const res = await api.auth.logout();
    if (redirect) history.push(redirect, {});
    if (!redirect) history.replace(ROUTES.HOME, {});
    return res;
  },
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

export const RESEND_CONFIRM_EMAIL_REQUEST = `${prefix}/RESEND_CONFIRM_EMAIL_REQUEST`;
export const RESEND_CONFIRM_EMAIL_SUCCESS = `${prefix}/RESEND_CONFIRM_EMAIL_SUCCESS`;
export const RESEND_CONFIRM_EMAIL_FAILURE = `${prefix}/RESEND_CONFIRM_EMAIL_FAILURE`;

export const resendConfirmEmail = (
  token: string,
  stateData: EmailConfirmationStateData,
): CommonPromiseAction => ({
  types: [
    RESEND_CONFIRM_EMAIL_REQUEST,
    RESEND_CONFIRM_EMAIL_SUCCESS,
    RESEND_CONFIRM_EMAIL_FAILURE,
  ],
  promise: (api: Api) =>
    minWaitTimeFunction(() => api.auth.resendConfirmEmail(token, stateData)),
});

export const CONFIRM_EMAIL_REQUEST = `${prefix}/CONFIRM_EMAIL_REQUEST`;
export const CONFIRM_EMAIL_SUCCESS = `${prefix}/CONFIRM_EMAIL_SUCCESS`;
export const CONFIRM_EMAIL_FAILURE = `${prefix}/CONFIRM_EMAIL_FAILURE`;

export const confirmEmail = (hash: string): CommonPromiseAction => ({
  types: [CONFIRM_EMAIL_REQUEST, CONFIRM_EMAIL_SUCCESS, CONFIRM_EMAIL_FAILURE],
  promise: (api: Api) => api.auth.confirm(hash),
});

export const UPDATE_EMAIL_REQ_REQUEST = `${prefix}/UPDATE_EMAIL_REQ_REQUEST`;
export const UPDATE_EMAIL_REQ_SUCCESS = `${prefix}/UPDATE_EMAIL_REQ_SUCCESS`;
export const UPDATE_EMAIL_REQ_FAILURE = `${prefix}/UPDATE_EMAIL_REQ_FAILURE`;

export const updateEmailRequest = (
  oldEmail: string,
  newEmail: string,
): CommonPromiseAction => ({
  types: [
    UPDATE_EMAIL_REQ_REQUEST,
    UPDATE_EMAIL_REQ_SUCCESS,
    UPDATE_EMAIL_REQ_FAILURE,
  ],
  promise: (api: Api) => api.auth.updateEmailRequest(oldEmail, newEmail),
  newEmail,
});

export const RESET_EMAIL_CONFIRMATION_RESULT = `${prefix}/RESET_EMAIL_CONFIRMATION_RESULT`;

export const resetEmailConfirmationResult = (): CommonAction => ({
  type: RESET_EMAIL_CONFIRMATION_RESULT,
});

export const UPDATE_EMAIL_REVERT_REQUEST = `${prefix}/UPDATE_EMAIL_REVERT_REQUEST`;
export const UPDATE_EMAIL_REVERT_SUCCESS = `${prefix}/UPDATE_EMAIL_REVERT_SUCCESS`;
export const UPDATE_EMAIL_REVERT_FAILURE = `${prefix}/UPDATE_EMAIL_REVERT_FAILURE`;

export const updateEmailRevert = (): CommonPromiseAction => ({
  types: [
    UPDATE_EMAIL_REVERT_REQUEST,
    UPDATE_EMAIL_REVERT_SUCCESS,
    UPDATE_EMAIL_REVERT_FAILURE,
  ],
  promise: (api: Api) => api.auth.updateEmailRevert(),
});

export const UPDATE_EMAIL_REQUEST = `${prefix}/UPDATE_EMAIL_REQUEST`;
export const UPDATE_EMAIL_SUCCESS = `${prefix}/UPDATE_EMAIL_SUCCESS`;
export const UPDATE_EMAIL_FAILURE = `${prefix}/UPDATE_EMAIL_FAILURE`;

export const updateEmail = (hash: string): CommonPromiseAction => ({
  types: [UPDATE_EMAIL_REQUEST, UPDATE_EMAIL_SUCCESS, UPDATE_EMAIL_FAILURE],
  promise: (api: Api) =>
    minWaitTimeFunction(() => api.auth.confirm(hash), 4000),
});

export const UPDATE_STATE_EMAIL = `${prefix}/UPDATE_STATE_EMAIL`;

export const updateStateEmail = (email: string): CommonAction => ({
  type: UPDATE_STATE_EMAIL,
  data: { email },
});
