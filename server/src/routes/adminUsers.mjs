import { makeServiceRunner } from '../tools';

import PersonalInfo from '../services/adminUsers/PersonalInfo.mjs';
import AdminUserInfo from '../services/adminUsers/AdminUserInfo.mjs';
import AdminUsersList from '../services/adminUsers/AdminUsersList.mjs';
import AdminUserUpdate from '../services/adminUsers/Update';
import AdminUserRemove from '../services/adminUsers/Remove';
import AdminUserInvite from '../services/adminUsers/Invite';
import AdminRolesList from '../services/adminUsers/AdminRolesList';
import AdminStatusesList from '../services/adminUsers/AdminStatusesList';
import OrdersList from '../services/adminUsers/OrdersList';
import OrderInfo from '../services/adminUsers/OrderInfo.mjs';
import RegularUserInfo from '../services/adminUsers/RegularUserInfo.mjs';
import RegularUsersList from '../services/adminUsers/RegularUsersList.mjs';
import FioAccountsList from '../services/adminUsers/FioAccountsList.mjs';
import FioAccountProfileUpdate from '../services/adminUsers/FioAccountProfileUpdate.mjs';
import FioAccountProfileCreate from '../services/adminUsers/FioAccountProfileCreate.mjs';
import Search from '../services/adminUsers/Search.mjs';

export default {
  personalInfo: makeServiceRunner(PersonalInfo),
  adminUserInfo: makeServiceRunner(AdminUserInfo, req => req.params),
  adminsList: makeServiceRunner(AdminUsersList, req => req.query),
  ordersList: makeServiceRunner(OrdersList, req => req.query),
  order: makeServiceRunner(OrderInfo, req => req.params),
  update: makeServiceRunner(AdminUserUpdate, req => req.body),
  remove: makeServiceRunner(AdminUserRemove, req => req.body),
  invite: makeServiceRunner(AdminUserInvite, req => req.body),
  rolesList: makeServiceRunner(AdminRolesList, req => req.body),
  statusesList: makeServiceRunner(AdminStatusesList, req => req.body),
  regularUserInfo: makeServiceRunner(RegularUserInfo, req => req.params),
  regularUsersList: makeServiceRunner(RegularUsersList, req => req.query),
  fioAccountsProfilesList: makeServiceRunner(FioAccountsList, req => req.query),
  createFioAccountProfile: makeServiceRunner(FioAccountProfileCreate, req => req.body),
  updateFioAccountProfile: makeServiceRunner(FioAccountProfileUpdate, req => ({
    ...req.body,
    ...req.params,
  })),
  search: makeServiceRunner(Search, req => req.query),
};
