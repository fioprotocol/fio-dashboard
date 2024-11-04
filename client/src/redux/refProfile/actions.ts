import { Api } from '../../api';

import { CommonAction, CommonPromiseAction } from '../types';

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

export const GET_REF_PROFILE_SETTINGS_REQUEST = `${prefix}/GET_REF_PROFILE_SETTINGS_REQUEST`;
export const GET_REF_PROFILE_SETTINGS_SUCCESS = `${prefix}/GET_REF_PROFILE_SETTINGS_SUCCESS`;
export const GET_REF_PROFILE_SETTINGS_FAILURE = `${prefix}/GET_REF_PROFILE_SETTINGS_FAILURE`;

export const getSettings = (code: string): CommonPromiseAction => ({
  types: [
    GET_REF_PROFILE_SETTINGS_REQUEST,
    GET_REF_PROFILE_SETTINGS_SUCCESS,
    GET_REF_PROFILE_SETTINGS_FAILURE,
  ],
  promise: (api: Api) => api.refProfile.getSettings(code),
});
