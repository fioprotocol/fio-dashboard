import { makeServiceRunner } from '../tools';

import DomainsList from '../services/registration/DomainsList.mjs';
import PrefixPostfixList from '../services/registration/PrefixPostfixList.mjs';

export default {
  domainsList: makeServiceRunner(DomainsList, req => ({
    cookies: { ...req.cookies },
  })),
  prefixPostfixList: makeServiceRunner(PrefixPostfixList),
};
