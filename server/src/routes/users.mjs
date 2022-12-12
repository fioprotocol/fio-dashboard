import { makeServiceRunner } from '../tools';

import UserAvailable from '../services/users/Available';
import UsersCreate from '../services/users/Create';
import UsersUpdate from '../services/users/Update';
import UsersInfo from '../services/users/Info';
import ShowInfo from '../services/users/Show';
import FreeAddressRegistered from '../services/users/FreeAddressRegistered';
import UsersSetRecovery from '../services/users/SetRecovery';
import UsersResendRecovery from '../services/users/ResendRecovery';
import UsersResendEmailConfirm from '../services/users/ResendEmailConfirm';
import UsersList from '../services/users/List';
import UsersUpdateEmailRequest from '../services/users/UpdateEmailRequest';
import UsersUpdateEmailRevert from '../services/users/UpdateEmailRevert';
import ActivateAffiliate from '../services/users/ActivateAffiliate';
import UpdateAffiliate from '../services/users/UpdateAffiliate';

export default {
  available: makeServiceRunner(UserAvailable, req => req.params),
  create: makeServiceRunner(UsersCreate, req => req.body),
  update: makeServiceRunner(UsersUpdate, req => req.body),
  info: makeServiceRunner(UsersInfo),
  setRecovery: makeServiceRunner(UsersSetRecovery, req => req.body),
  resendRecovery: makeServiceRunner(UsersResendRecovery, req => req.body),
  resendEmailConfirm: makeServiceRunner(UsersResendEmailConfirm, req => req.body),
  list: makeServiceRunner(UsersList, req => req.query),
  show: makeServiceRunner(ShowInfo, req => req.params),
  freeAddress: makeServiceRunner(FreeAddressRegistered, req => req.params),
  updateEmailRequest: makeServiceRunner(UsersUpdateEmailRequest, req => req.body),
  updateEmailRevert: makeServiceRunner(UsersUpdateEmailRevert, req => req.body),
  activateAffiliate: makeServiceRunner(ActivateAffiliate, req => req.body),
  updateAffiliate: makeServiceRunner(UpdateAffiliate, req => req.body),
};
