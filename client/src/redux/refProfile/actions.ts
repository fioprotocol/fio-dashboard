import { Api } from '../../api';
import { validateRefActionQuery } from '../../util/ref';

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
export const SET_CONTAINED_PARAMS_ERROR = `${prefix}/SET_CONTAINED_PARAMS_ERROR`;

export const setContainedParams = (params: any) => {
  try {
    validateRefActionQuery(params);
  } catch (e) {
    return {
      type: SET_CONTAINED_PARAMS_ERROR,
      data: 'The referral link is invalid',
    };
  }
  if (params.metadata != null) {
    try {
      params.metadata = JSON.parse(decodeURI(params.metadata));
    } catch (e) {
      console.error(e);
    }
  }
  return {
    type: SET_CONTAINED_PARAMS,
    data: params,
  };
};
export const SET_STEP = `${prefix}/SET_STEP`;

export const setStep = (step: string) => ({
  type: SET_CONTAINED_PARAMS,
  data: step,
});
