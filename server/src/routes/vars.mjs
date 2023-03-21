import { makeServiceRunner } from '../tools';

import VarsUpdate from '../services/Vars/Update';
import VarsGet from '../services/Vars/Get';

export default {
  get: makeServiceRunner(VarsGet, req => req.params),
  update: makeServiceRunner(VarsUpdate, req => ({
    ...req.params,
    ...req.body,
  })),
};
