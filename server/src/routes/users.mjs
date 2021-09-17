import { makeServiceRunner } from '../tools';

import UserAvailable from '../services/users/Available';
import UsersCreate from '../services/users/Create';
import UsersUpdate from '../services/users/Update';
import UsersInfo from '../services/users/Info';
import ShowInfo from '../services/users/Show';
import FreeAddressRegistered from '../services/users/FreeAddressRegistered';
import UsersResetPassword from '../services/users/ResetPassword';
import UsersSetRecovery from '../services/users/SetRecovery';
import UsersResendRecovery from '../services/users/ResendRecovery';
import UsersList from '../services/users/List';

export default {
  available: makeServiceRunner(UserAvailable, req => req.params),
  create: makeServiceRunner(UsersCreate, req => req.body),
  update: makeServiceRunner(UsersUpdate, req => req.body),
  info: makeServiceRunner(UsersInfo),
  resetPassword: makeServiceRunner(UsersResetPassword, req => req.body),
  setRecovery: makeServiceRunner(UsersSetRecovery, req => req.body),
  resendRecovery: makeServiceRunner(UsersResendRecovery, req => req.body),
  list: makeServiceRunner(UsersList),
  show: makeServiceRunner(ShowInfo, req => req.params),
  freeAddress: makeServiceRunner(FreeAddressRegistered, req => req.params),
};
