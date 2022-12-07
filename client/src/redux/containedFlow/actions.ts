import { validateContainedFlowActionQuery } from '../../util/containedFlow';
import { log } from '../../util/general';

import { CONTAINED_FLOW_ACTIONS } from '../../constants/containedFlow';

import {
  ContainedFlowActionSettingsKey,
  ContainedFlowQuery,
  ContainedFlowQueryParams,
} from '../../types';
import { CommonAction } from '../types';

export const prefix = 'containedFlow';

export const SET_CONTAINED_PARAMS = `${prefix}/SET_CONTAINED_PARAMS`;
export const SET_CONTAINED_PARAMS_ERROR = `${prefix}/SET_CONTAINED_PARAMS_ERROR`;

export const setContainedParams = (query: ContainedFlowQuery): CommonAction => {
  try {
    validateContainedFlowActionQuery(query);
  } catch (e) {
    return {
      type: SET_CONTAINED_PARAMS_ERROR,
      data: 'The referral link is invalid',
    };
  }

  let params: ContainedFlowQueryParams = {
    action: query.action?.toUpperCase() as ContainedFlowActionSettingsKey,
  };

  if (query.r) {
    params.r = query.r;
  }

  switch (query.action.toUpperCase()) {
    case CONTAINED_FLOW_ACTIONS.SIGNNFT: {
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

export const setStep = (
  step: string,
  data?: {
    redirectUrl?: string;
    containedFlowAction?: string;
  },
): CommonAction => ({
  type: SET_STEP,
  data,
  step,
});

export const RESET_CONTAINED_PARAMS = `${prefix}/RESET_CONTAINED_PARAMS`;

export const resetContainedParams = (): CommonAction => ({
  type: RESET_CONTAINED_PARAMS,
});
