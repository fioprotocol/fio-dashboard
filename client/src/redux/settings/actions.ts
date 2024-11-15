import { Api } from '../../api';
import { CommonPromiseAction } from '../types';

export const prefix = 'settings';

export const GET_SITE_SETTINGS_REQUEST = `${prefix}/GET_SITE_SETTINGS_REQUEST`;
export const GET_SITE_SETTINGS_SUCCESS = `${prefix}/GET_SITE_SETTINGS_SUCCESS`;
export const GET_SITE_SETTINGS_FAILURE = `${prefix}/GET_SITE_SETTINGS_FAILURE`;

export const getSiteSettings = (): CommonPromiseAction => ({
  types: [
    GET_SITE_SETTINGS_REQUEST,
    GET_SITE_SETTINGS_SUCCESS,
    GET_SITE_SETTINGS_FAILURE,
  ],
  promise: (api: Api) => api.general.getSiteSettings(),
});
