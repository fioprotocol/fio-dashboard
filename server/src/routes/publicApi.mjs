import { makeServiceRunner } from '../tools';

import BuyAddress from '../services/publicApi/BuyAddress.mjs';
import Renew from '../services/publicApi/Renew.mjs';
import Summary from '../services/publicApi/Summary.mjs';
import IsDomainPublic from '../services/publicApi/IsDomainPublic.mjs';
import GetDomains from '../services/publicApi/GetDomains.mjs';

export default {
  buyAddress: makeServiceRunner(BuyAddress, req => req.body),
  renew: makeServiceRunner(Renew, req => req.body),
  summary: makeServiceRunner(Summary, req => req.body),
  isDomainPublic: makeServiceRunner(IsDomainPublic, req => req.params),
  getDomains: makeServiceRunner(GetDomains, req => req.params),
};
