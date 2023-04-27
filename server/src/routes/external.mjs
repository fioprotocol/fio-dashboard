import { makeServiceRunner } from '../tools';

import GetPrices from '../services/external/Prices';
import Captcha from '../services/external/Captcha';
import ValidatePubAddress from '../services/external/ValidatePubAddress';
import ApiUrls from '../services/external/ApiUrls';
import InfuraNfts from '../services/external/GetInfuraNfts.mjs';

export default {
  prices: makeServiceRunner(GetPrices, req => req.query),
  initCaptcha: makeServiceRunner(Captcha),
  validatePubAddress: makeServiceRunner(ValidatePubAddress, req => req.query),
  apiUrls: makeServiceRunner(ApiUrls),
  infuraNfts: makeServiceRunner(InfuraNfts, req => req.query),
};
