import { makeServiceRunner } from '../tools';

import GetPrices from '../services/external/Prices';
import GetDomains from '../services/external/Domains';

export default {
  prices: makeServiceRunner(GetPrices),
  domains: makeServiceRunner(GetDomains),
};
