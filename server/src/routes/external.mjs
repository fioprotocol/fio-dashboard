import { makeServiceRunner } from '../tools';

import GetPrices from '../services/external/Prices';
import GetGasOracle from '../services/external/GetGasOracle.mjs';
import GetEdgeApiCreds from '../services/external/GetEdgeApiCreds.mjs';
import GetEstimationOfConfirmationTime from '../services/external/GetEstimationOfConfirmationTime.mjs';
import Captcha from '../services/external/Captcha';
import ValidatePubAddress from '../services/external/ValidatePubAddress';
import ApiUrls from '../services/external/ApiUrls';
import GetExternalProviderNfts from '../services/external/GetExternalProviderNfts.mjs';
import GetExternalProviderNftsMetadata from '../services/external/GetExternalProviderNftsMetadata.mjs';
import GetExternalAllTokens from '../services/external/GetExternalAllTokens.mjs';
import AbstractEmailVerification from '../services/external/AbstractEmailVerification.mjs';

export default {
  prices: makeServiceRunner(GetPrices, req => req.query),
  initCaptcha: makeServiceRunner(Captcha),
  getGasOracle: makeServiceRunner(GetGasOracle, req => req.query),
  getEdgeApiCreds: makeServiceRunner(GetEdgeApiCreds),
  getEstimationOfConfirmationTime: makeServiceRunner(
    GetEstimationOfConfirmationTime,
    req => req.query,
  ),
  validatePubAddress: makeServiceRunner(ValidatePubAddress, req => req.query),
  apiUrls: makeServiceRunner(ApiUrls, req => req.query),
  externalProviderNfts: makeServiceRunner(GetExternalProviderNfts, req => req.query),
  externalProviderNftsMetadata: makeServiceRunner(
    GetExternalProviderNftsMetadata,
    req => req.query,
  ),
  getAllExternalTokens: makeServiceRunner(GetExternalAllTokens, req => req.query),
  abstractEmailVerification: makeServiceRunner(
    AbstractEmailVerification,
    req => req.query,
  ),
};
