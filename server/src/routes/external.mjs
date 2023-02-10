import { makeServiceRunner } from '../tools';

import GetPrices from '../services/external/Prices';
import Captcha from '../services/external/Captcha';
import ValidatePubAddress from '../services/external/ValidatePubAddress';
import ApiUrls from '../services/external/ApiUrls';

export default {
  prices: makeServiceRunner(GetPrices),
  initCaptcha: makeServiceRunner(Captcha),
  validatePubAddress: makeServiceRunner(ValidatePubAddress, req => req.query),
  apiUrls: makeServiceRunner(ApiUrls),
};
