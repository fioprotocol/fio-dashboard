import { RefQuery } from '../types';
import { REF_ACTIONS } from '../constants/common';

export const validateRefActionQuery = (query: RefQuery) => {
  if (!query.action) throw new Error('Ref action is required');
  if (!query.r) throw new Error('Redirect url is required');

  switch (query.action) {
    case REF_ACTIONS.SIGNNFT: {
      if (
        query.chain_code &&
        query.contract_address &&
        query.hash &&
        query.token_id &&
        query.url &&
        query.metadata
      )
        return true;
      throw new Error(`Invalid params for ${REF_ACTIONS.SIGNNFT} action`);
      break;
    }
    default:
      throw new Error('Invalid action');
  }
};
