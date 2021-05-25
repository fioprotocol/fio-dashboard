import { makeServiceRunner } from '../tools';

import GetPrices from '../services/external/Prices';
import GetDomains from '../services/external/Domains';
import Register from '../services/external/Register';

export default {
  prices: makeServiceRunner(GetPrices),
  domains: makeServiceRunner(GetDomains),
  register: makeServiceRunner(Register, req => req.body),
};
