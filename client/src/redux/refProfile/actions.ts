import { Api } from '../../api';

export const prefix = 'refProfile';

export const GET_REF_PROFILE_REQUEST = `${prefix}/GET_REF_PROFILE_REQUEST`;
export const GET_REF_PROFILE_SUCCESS = `${prefix}/GET_REF_PROFILE_SUCCESS`;
export const GET_REF_PROFILE_FAILURE = `${prefix}/GET_REF_PROFILE_FAILURE`;

export const getInfo = (code: string) => ({
  types: [
    GET_REF_PROFILE_REQUEST,
    GET_REF_PROFILE_SUCCESS,
    GET_REF_PROFILE_FAILURE,
  ],
  promise: (api: Api) => api.refProfile.get(code),
});

export const SET_CONTAINED_PARAMS = `${prefix}/SET_CONTAINED_PARAMS`;

export const setContainedParams = (params: any) => ({
  type: SET_CONTAINED_PARAMS,
  data: params,
});
