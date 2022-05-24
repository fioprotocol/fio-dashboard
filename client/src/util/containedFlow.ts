import { ContainedFlowQuery } from '../types';
import { CONTAINED_FLOW_ACTIONS } from '../constants/containedFlow';

export const validateContainedFlowActionQuery = (
  query: ContainedFlowQuery,
): boolean => {
  if (!query.action) throw new Error('Contained flow action is required');
  if (!query.r) throw new Error('Redirect url is required');

  switch (query.action) {
    case CONTAINED_FLOW_ACTIONS.SIGNNFT: {
      if (query.chain_code && query.contract_address) return true;
      throw new Error(
        `Invalid params for ${CONTAINED_FLOW_ACTIONS.SIGNNFT} action`,
      );
    }
    default:
      throw new Error('Invalid action');
  }
};
