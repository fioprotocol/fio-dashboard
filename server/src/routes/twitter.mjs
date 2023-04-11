import { makeServiceRunner } from '../tools';

import VerifyTwitter from '../services/external/VerifyTwitter';

export default {
  verify: makeServiceRunner(VerifyTwitter, req => req.body),
};
