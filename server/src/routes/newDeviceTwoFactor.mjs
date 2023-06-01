import { makeServiceRunner } from '../tools';

import NewDeviceTwoFactorCreate from '../services/twoFactor/Create';
import NewDeviceTwoFactorDelete from '../services/twoFactor/Delete';
import NewDeviceTwoFactorUpdate from '../services/twoFactor/Update';
import NewDeviceTwoFactorCheckRejected from '../services/twoFactor/CheckRejected';

export default {
  create: makeServiceRunner(NewDeviceTwoFactorCreate, req => req.body),
  delete: makeServiceRunner(NewDeviceTwoFactorDelete, req => req.body),
  update: makeServiceRunner(NewDeviceTwoFactorUpdate, req => ({
    id: req.params.id,
    data: req.body.data,
  })),
  checkRejected: makeServiceRunner(NewDeviceTwoFactorCheckRejected, req => req.query),
};
