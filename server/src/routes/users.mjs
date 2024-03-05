import { makeServiceRunner } from '../tools';

import AlternativeUserVerification from '../services/users/AlternativeUserVerification.mjs';
import UserAvailable from '../services/users/Available';
import UsersCreate from '../services/users/Create';
import UsersUpdate from '../services/users/Update';
import UsersInfo from '../services/users/Info';
import ShowInfo from '../services/users/Show';
import FreeAddressRegistered from '../services/users/FreeAddressRegistered';
import UsersSetRecovery from '../services/users/SetRecovery';
import UsersResendRecovery from '../services/users/ResendRecovery';
import UsersList from '../services/users/List';
import UsersUpdateEmail from '../services/users/UpdateEmail';
import UsersUpdateEmailNotificationParams from '../services/users/UpdateEmailNotificationParams';
import ActivateAffiliate from '../services/users/ActivateAffiliate';
import UpdateAffiliate from '../services/users/UpdateAffiliate';
import UsersDetailedInfo from '../services/users/DetailedInfo';
import UsersSendEvent from '../services/users/SendEvent';
import UsersDelete from '../services/users/Delete';

export default {
  alternativeUserVerification: makeServiceRunner(AlternativeUserVerification),
  available: makeServiceRunner(UserAvailable, req => req.params),
  create: makeServiceRunner(UsersCreate, req => req.body),
  update: makeServiceRunner(UsersUpdate, req => req.body),
  delete: makeServiceRunner(UsersDelete),
  info: makeServiceRunner(UsersInfo),
  detailedInfo: makeServiceRunner(UsersDetailedInfo, req => req.params),
  setRecovery: makeServiceRunner(UsersSetRecovery, req => req.body),
  resendRecovery: makeServiceRunner(UsersResendRecovery, req => req.body),
  list: makeServiceRunner(UsersList, req => req.query),
  show: makeServiceRunner(ShowInfo, req => req.params),
  freeAddress: makeServiceRunner(FreeAddressRegistered, req => req.params),
  updateEmail: makeServiceRunner(UsersUpdateEmail, req => req.body),
  updateEmailNotificationParams: makeServiceRunner(
    UsersUpdateEmailNotificationParams,
    req => req.body,
  ),
  activateAffiliate: makeServiceRunner(ActivateAffiliate, req => req.body),
  updateAffiliate: makeServiceRunner(UpdateAffiliate, req => req.body),
  sendEvent: makeServiceRunner(UsersSendEvent, req => req.body),
};
