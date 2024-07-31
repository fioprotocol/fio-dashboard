import { makeServiceRunner } from '../tools';

import DomainsList from '../services/registration/DomainsList.mjs';
import PrefixPostfixList from '../services/registration/PrefixPostfixList.mjs';

export default {
  domainsList: makeServiceRunner(DomainsList, req => req.query),
  prefixPostfixList: makeServiceRunner(PrefixPostfixList),
};
