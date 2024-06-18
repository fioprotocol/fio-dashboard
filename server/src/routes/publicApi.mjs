import { makeServiceRunner } from '../tools';

import BuyAddress from '../services/publicApi/BuyAddress';
import Renew from '../services/publicApi/Renew';
import Summary from '../services/publicApi/Summary';

export default {
  buyAddress: makeServiceRunner(BuyAddress, req => req.body),
  renew: makeServiceRunner(Renew, req => req.body),
  summary: makeServiceRunner(Summary, req => req.body),
};
