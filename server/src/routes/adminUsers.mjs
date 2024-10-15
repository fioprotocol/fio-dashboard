import { makeServiceRunner } from '../tools';

import PersonalInfo from '../services/adminUsers/PersonalInfo.mjs';
import AdminUserInfo from '../services/adminUsers/AdminUserInfo.mjs';
import AdminUsersList from '../services/adminUsers/AdminUsersList.mjs';
import AdminUserUpdate from '../services/adminUsers/Update';
import AdminUserRemove from '../services/adminUsers/Remove';
import AdminUserSendResetPassword from '../services/adminUsers/SendResetPassword.mjs';
import AdminUserInvite from '../services/adminUsers/Invite';
import AdminRolesList from '../services/adminUsers/AdminRolesList';
import AdminStatusesList from '../services/adminUsers/AdminStatusesList';
import OrdersList from '../services/adminUsers/OrdersList';
import ExportOrdersData from '../services/adminUsers/ExportOrdersData';
import OrderInfo from '../services/adminUsers/OrderInfo.mjs';
import FioAccountsList from '../services/adminUsers/FioAccountsList.mjs';
import FioAccountProfileUpdate from '../services/adminUsers/FioAccountProfileUpdate.mjs';
import FioAccountProfileCreate from '../services/adminUsers/FioAccountProfileCreate.mjs';
import FioAccountProfileDelete from '../services/adminUsers/FioAccountProfileDelete.mjs';
import PartnersList from '../services/adminUsers/PartnersList.mjs';
import PartnerUpdate from '../services/adminUsers/PartnerUpdate.mjs';
import PartnerCreate from '../services/adminUsers/PartnerCreate.mjs';
import PartnerCreateApiToken from '../services/adminUsers/PartnerCreateApiToken.mjs';
import Search from '../services/adminUsers/Search.mjs';
import DefaultList from '../services/adminUsers/DefaultList.mjs';
import DefaultsSave from '../services/adminUsers/DefaultsSave.mjs';
import FioApiUrlsList from '../services/adminUsers/FioApiUrlsList';
import FioApiUrlCreate from '../services/adminUsers/FioApiUrlCreate';
import FioApiUrlUpdate from '../services/adminUsers/FioApiUrlUpdate';
import FioApiUrlDelete from '../services/adminUsers/FioApiUrlDelete';
import FioApiUrlsUpdate from '../services/adminUsers/FioApiUrlsListUpdate';
import AdminChangePassword from '../services/adminUsers/AdminChangePassword.mjs';
import AdminUserChange2FA from '../services/adminUsers/AdminChange2FA.mjs';

export default {
  personalInfo: makeServiceRunner(PersonalInfo),
  adminUserInfo: makeServiceRunner(AdminUserInfo, req => req.params),
  adminsList: makeServiceRunner(AdminUsersList, req => req.query),
  ordersList: makeServiceRunner(OrdersList, req => req.query),
  exportOrdersData: makeServiceRunner(ExportOrdersData, req => req.query),
  order: makeServiceRunner(OrderInfo, req => req.params),
  update: makeServiceRunner(AdminUserUpdate, req => req.body),
  remove: makeServiceRunner(AdminUserRemove, req => req.body),
  sendResetPassword: makeServiceRunner(AdminUserSendResetPassword, req => req.params),
  invite: makeServiceRunner(AdminUserInvite, req => req.body),
  rolesList: makeServiceRunner(AdminRolesList, req => req.body),
  statusesList: makeServiceRunner(AdminStatusesList, req => req.body),
  fioAccountsProfilesList: makeServiceRunner(FioAccountsList, req => req.query),
  createFioAccountProfile: makeServiceRunner(FioAccountProfileCreate, req => req.body),
  updateFioAccountProfile: makeServiceRunner(FioAccountProfileUpdate, req => ({
    ...req.body,
    ...req.params,
  })),
  deleteFioAccountProfile: makeServiceRunner(FioAccountProfileDelete, req => req.params),
  partnersList: makeServiceRunner(PartnersList, req => req.query),
  createPartner: makeServiceRunner(PartnerCreate, req => req.body),
  createPartnerApiToken: makeServiceRunner(PartnerCreateApiToken),
  updatePartner: makeServiceRunner(PartnerUpdate, req => ({
    ...req.body,
    ...req.params,
  })),
  search: makeServiceRunner(Search, req => req.query),
  getDefaults: makeServiceRunner(DefaultList),
  saveDefaults: makeServiceRunner(DefaultsSave, req => req.body),
  fioApiUrlsList: makeServiceRunner(FioApiUrlsList, req => req.query),
  createFioApiUrlsList: makeServiceRunner(FioApiUrlCreate, req => req.body),
  updateFioApiUrl: makeServiceRunner(FioApiUrlUpdate, req => ({
    ...req.body,
    ...req.params,
  })),
  updateFioApiUrlsList: makeServiceRunner(FioApiUrlsUpdate, req => req.body),
  deleteFioApiUrlsList: makeServiceRunner(FioApiUrlDelete, req => req.params),
  changePassword: makeServiceRunner(AdminChangePassword, req => req.body),
  change2FA: makeServiceRunner(AdminUserChange2FA, req => req.body),
};
