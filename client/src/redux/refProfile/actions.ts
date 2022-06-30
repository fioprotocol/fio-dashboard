import { Api } from '../../api';

import { CommonPromiseAction } from '../types';

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

export const SET_CONTAINED_PARAMS = `${prefix}/SET_CONTAINED_PARAMS`;
export const SET_CONTAINED_PARAMS_ERROR = `${prefix}/SET_CONTAINED_PARAMS_ERROR`;
