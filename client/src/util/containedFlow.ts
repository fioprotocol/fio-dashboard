import { ContainedFlowQuery } from '../types';
import { CONTAINED_FLOW_ACTIONS } from '../constants/containedFlow';
import { removeExtraCharactersFromString } from '../util/general';

export const validateContainedFlowActionQuery = (
  query: ContainedFlowQuery,
): boolean => {
  if (!query.action) throw new Error('Contained flow action is required');

  switch (removeExtraCharactersFromString(query.action)) {
    case removeExtraCharactersFromString(CONTAINED_FLOW_ACTIONS.SIGNNFT): {
      if (query.chain_code && query.contract_address) return true;
      throw new Error(
        `Invalid params for ${CONTAINED_FLOW_ACTIONS.SIGNNFT} action`,
      );
    }
    case CONTAINED_FLOW_ACTIONS.REG: {
      return true;
    }
    default:
      throw new Error('Invalid action');
  }
};

export const compareContainedFlowAction = (
  containedFlowAction: string,
  comparedContainedFlowAction: string,
): boolean =>
  removeExtraCharactersFromString(containedFlowAction) ===
  removeExtraCharactersFromString(comparedContainedFlowAction);
