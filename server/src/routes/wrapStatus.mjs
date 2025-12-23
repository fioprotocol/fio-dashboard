import { makeServiceRunner } from '../tools';

import WrapStatus from '../services/wrapStatus/WrapStatus.mjs';

export default {
  getWrapStatusPageData: makeServiceRunner(WrapStatus, req => req.query),
};
