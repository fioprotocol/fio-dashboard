import { makeServiceRunner } from '../tools';

import { ChainCodesQueryList } from '../services/chainCodes/QueryList.mjs';

export default {
  list: makeServiceRunner(ChainCodesQueryList, req => req.params),
};
