import { makeServiceRunner } from '../tools';

import GetPrices from '../services/external/Prices';
import GetDomains from '../services/external/Domains';
import Register from '../services/external/Register';
import Captcha from '../services/external/Captcha';
import ValidatePubAddress from '../services/external/ValidatePubAddress';

export default {
  prices: makeServiceRunner(GetPrices),
  domains: makeServiceRunner(GetDomains),
  register: makeServiceRunner(Register, req => req.body),
  initCaptcha: makeServiceRunner(Captcha),
  validatePubAddress: makeServiceRunner(ValidatePubAddress, req => req.query),
};
