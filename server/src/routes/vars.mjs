import { makeServiceRunner } from '../tools';

import VarsUpdate from '../services/vars/Update';
import VarsGet from '../services/vars/Get';
import VarsUpdateEmail from '../services/vars/UpdateEmail.mjs';

export default {
  get: makeServiceRunner(VarsGet, req => req.params),
  update: makeServiceRunner(VarsUpdate, req => ({
    ...req.params,
    ...req.body,
  })),
  updateEmail: makeServiceRunner(VarsUpdateEmail, req => ({
    ...req.params,
    ...req.body,
  })),
};
