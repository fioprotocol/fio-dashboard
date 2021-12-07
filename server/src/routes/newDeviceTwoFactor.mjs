import { makeServiceRunner } from '../tools';

import NewDeviceTwoFactorCreate from '../services/twoFactor/Create';
import NewDeviceTwoFactorDelete from '../services/twoFactor/Delete';

export default {
  create: makeServiceRunner(NewDeviceTwoFactorCreate, req => req.body),
  delete: makeServiceRunner(NewDeviceTwoFactorDelete, req => req.body),
};
