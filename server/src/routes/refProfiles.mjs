import { makeServiceRunner } from '../tools';

import RefProfileInfo from '../services/refProfile/Info';

export default {
  info: makeServiceRunner(RefProfileInfo, req => req.params),
};
