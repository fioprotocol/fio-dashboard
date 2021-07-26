import { Ecc } from '@fioprotocol/fiojs';
import { Api } from '../../api';
import { ROUTES } from '../../constants/routes';
import { FioWalletDoublet, WalletKeysObj } from '../../types';
import { RouterProps } from 'react-router';

export const prefix: string = 'profile';

export const PROFILE_REQUEST = `${prefix}/PROFILE_REQUEST`;
export const PROFILE_SUCCESS = `${prefix}/PROFILE_SUCCESS`;
export const PROFILE_FAILURE = `${prefix}/PROFILE_FAILURE`;

export const loadProfile = () => ({
  types: [PROFILE_REQUEST, PROFILE_SUCCESS, PROFILE_FAILURE],
  promise: (api: Api) => api.auth.profile(),
});

export const NONCE_REQUEST = `${prefix}/NONCE_REQUEST`;
export const NONCE_SUCCESS = `${prefix}/NONCE_SUCCESS`;
export const NONCE_FAILURE = `${prefix}/NONCE_FAILURE`;

export const nonce = (username: string, keys: WalletKeysObj) => ({
  types: [NONCE_REQUEST, NONCE_SUCCESS, NONCE_FAILURE],
  promise: async (api: Api) => {
    const { nonce, email } = await api.auth.nonce(username);
    const signature: string = Ecc.sign(nonce, Object.values(keys)[0].private);
    return { email, nonce, signature };
  },
});

export const LOGIN_REQUEST = `${prefix}/LOGIN_REQUEST`;
export const LOGIN_SUCCESS = `${prefix}/LOGIN_SUCCESS`;
export const LOGIN_FAILURE = `${prefix}/LOGIN_FAILURE`;

export const login = ({
  email,
  signature,
  challenge,
}: {
  email: string;
  signature: string;
  challenge: string;
}) => ({
  types: [LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE],
  promise: (api: Api) => api.auth.login(email, signature, challenge),
});

export const SIGNUP_REQUEST = `${prefix}/SIGNUP_REQUEST`;
export const SIGNUP_SUCCESS = `${prefix}/SIGNUP_SUCCESS`;
export const SIGNUP_FAILURE = `${prefix}/SIGNUP_FAILURE`;
export const RESET_SUCCESS_STATE = `${prefix}/RESET_SUCCESS_STATE`;

export const signup = (data: {
  username: string;
  email: string;
  fioWallets: FioWalletDoublet[];
}) => ({
  types: [SIGNUP_REQUEST, SIGNUP_SUCCESS, SIGNUP_FAILURE],
  promise: (api: Api) => api.auth.signup(data),
  fioWallets: data.fioWallets,
});

export const resetSuccessState = () => ({
  type: RESET_SUCCESS_STATE,
});

export const LOGOUT_REQUEST = `${prefix}/LOGOUT_REQUEST`;
export const LOGOUT_SUCCESS = `${prefix}/LOGOUT_SUCCESS`;
export const LOGOUT_FAILURE = `${prefix}/LOGOUT_FAILURE`;

export const logout = ({ history }: RouterProps) => ({
  types: [LOGOUT_REQUEST, LOGOUT_SUCCESS, LOGOUT_FAILURE],
  promise: async (api: Api) => {
    const res = await api.auth.logout();
    history.push(ROUTES.HOME);
    return res;
  },
});

export const CONFIRM_REQUEST = `${prefix}/CONFIRM_REQUEST`;
export const CONFIRM_SUCCESS = `${prefix}/CONFIRM_SUCCESS`;
export const CONFIRM_FAILURE = `${prefix}/CONFIRM_FAILURE`;

export const confirm = (hash: string) => ({
  types: [CONFIRM_REQUEST, CONFIRM_SUCCESS, CONFIRM_FAILURE],
  promise: (api: Api) => api.auth.confirm(hash),
});

export const PASSWORD_RECOVERY_REQUEST = `${prefix}/PASSWORD_RECOVERY_REQUEST`;
export const PASSWORD_RECOVERY_SUCCESS = `${prefix}/PASSWORD_RECOVERY_SUCCESS`;
export const PASSWORD_RECOVERY_FAILURE = `${prefix}/PASSWORD_RECOVERY_FAILURE`;

export const passwordRecovery = ({ email }: { email: string }) => ({
  types: [
    PASSWORD_RECOVERY_REQUEST,
    PASSWORD_RECOVERY_SUCCESS,
    PASSWORD_RECOVERY_FAILURE,
  ],
  promise: (api: Api) => api.auth.resetPassword(email),
});

export const SET_RECOVERY_REQUEST = `${prefix}/SET_RECOVERY_REQUEST`;
export const SET_RECOVERY_SUCCESS = `${prefix}/SET_RECOVERY_SUCCESS`;
export const SET_RECOVERY_FAILURE = `${prefix}/SET_RECOVERY_FAILURE`;

export const setRecoveryQuestions = (token: string) => ({
  types: [SET_RECOVERY_REQUEST, SET_RECOVERY_SUCCESS, SET_RECOVERY_FAILURE],
  promise: (api: Api) => api.auth.setRecovery(token),
});

export const RESET_PASSWORD_REQUEST = `${prefix}/RESET_PASSWORD_REQUEST`;
export const RESET_PASSWORD_SUCCESS = `${prefix}/RESET_PASSWORD_SUCCESS`;
export const RESET_PASSWORD_FAILURE = `${prefix}/RESET_PASSWORD_FAILURE`;

export const resetPassword = ({
  hash,
  password,
  confirmPassword,
}: {
  hash: string;
  password: string;
  confirmPassword: string;
}) => ({
  types: [
    RESET_PASSWORD_REQUEST,
    RESET_PASSWORD_SUCCESS,
    RESET_PASSWORD_FAILURE,
  ],
  promise: (api: Api) => api.auth.setPassword(hash, password, confirmPassword),
});

export const RESET_LAST_AUTH_DATA = `${prefix}/RESET_LAST_AUTH_DATA`;

export const resetLastAuthData = () => ({
  type: RESET_LAST_AUTH_DATA,
});
