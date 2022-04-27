import { Api } from '../../api';

import { validateRefActionQuery } from '../../util/ref';
import { log } from '../../util/general';

import { REF_ACTIONS } from '../../constants/common';

import { RefQuery, RefQueryParams } from '../../types';
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

export const SET_CONTAINED_PARAMS = `${prefix}/SET_CONTAINED_PARAMS`;
export const SET_CONTAINED_PARAMS_ERROR = `${prefix}/SET_CONTAINED_PARAMS_ERROR`;

export const setContainedParams = (query: RefQuery): CommonAction => {
  try {
    validateRefActionQuery(query);
  } catch (e) {
    return {
      type: SET_CONTAINED_PARAMS_ERROR,
      data: 'The referral link is invalid',
    };
  }

  let params: RefQueryParams = {
    action: query.action,
    r: query.r,
  };

  switch (query.action) {
    case REF_ACTIONS.SIGNNFT: {
      params = {
        ...params,
        contractAddress: query.contract_address,
        chainCode: query.chain_code,
        tokenId: query.token_id,
        hash: query.hash,
        url: query.url,
        metadata: { creatorUrl: '' },
      };

      if (query.metadata != null) {
        try {
          const { creator_url, ...rest } = JSON.parse(
            decodeURI(query.metadata),
          );
          params.metadata = {
            creatorUrl: creator_url,
            ...rest,
          };
        } catch (e) {
          log.error(e);
        }
      }

      if (params.metadata.creatorUrl == null || !params.metadata.creatorUrl) {
        params.metadata.creatorUrl = '';
      }
      break;
    }
    default:
    //
  }

  return {
    type: SET_CONTAINED_PARAMS,
    data: params,
  };
};

export const SET_STEP = `${prefix}/SET_STEP`;

export const setStep = (step: string): CommonAction => ({
  type: SET_STEP,
  data: step,
});
