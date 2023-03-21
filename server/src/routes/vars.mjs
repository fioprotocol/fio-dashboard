import { makeServiceRunner } from '../tools';

import VarsUpdate from '../services/vars/Update';
import VarsGet from '../services/vars/Get';

export default {
  get: makeServiceRunner(VarsGet, req => req.params),
  update: makeServiceRunner(VarsUpdate, req => ({
    ...req.params,
    ...req.body,
  })),
};
