import { makeServiceRunner } from '../tools';

import { ChainCodesQueryList } from '../services/chainCodes/QueryList.mjs';
import { SelectedChainCodesList } from '../services/chainCodes/SelectedChainCodesList.mjs';

export default {
  list: makeServiceRunner(ChainCodesQueryList, req => req.params),
  selectedList: makeServiceRunner(SelectedChainCodesList, req => req.query),
};
