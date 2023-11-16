import { makeServiceRunner } from '../tools';

import NftTokenVerification from '../services/metamask/NftTokenVerification.mjs';

export default {
  nftTokenVerification: makeServiceRunner(NftTokenVerification, req => req.query),
};
