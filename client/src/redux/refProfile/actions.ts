import { Api } from '../../api';

import { CommonAction, CommonPromiseAction } from '../types';
import { RefProfile } from '../../types';

export const prefix = 'refProfile';

export const GET_REF_PROFILE_REQUEST = `${prefix}/GET_REF_PROFILE_REQUEST`;
export const GET_REF_PROFILE_SUCCESS = `${prefix}/GET_REF_PROFILE_SUCCESS`;
export const GET_REF_PROFILE_FAILURE = `${prefix}/GET_REF_PROFILE_FAILURE`;

export const getInfo = (code: string): CommonPromiseAction => ({
  types: [
    GET_REF_PROFILE_REQUEST,
    GET_REF_PROFILE_SUCCESS,
    GET_REF_PROFILE_FAILURE,
  ],
  promise: (api: Api) => api.refProfile.get(code),
});

export const CLEAR_REF_PROFILE = `${prefix}/CLEAR_REF_PROFILE`;

export const clear = (): CommonAction => ({
  type: CLEAR_REF_PROFILE,
});

export const SET_CONTAINED_PARAMS = `${prefix}/SET_CONTAINED_PARAMS`;
export const SET_CONTAINED_PARAMS_ERROR = `${prefix}/SET_CONTAINED_PARAMS_ERROR`;

export const SET_REF_PROFILE_SETTINGS = `${prefix}/SET_REF_PROFILE_SETTINGS`;

export const setSettings = ({
  settings,
}: Pick<RefProfile, 'settings'>): CommonPromiseAction => ({
  type: SET_REF_PROFILE_SETTINGS,
  data: settings,
});
