import { makeServiceRunner } from '../tools';

import AdminUserInfo from '../services/adminUsers/Info';
import AdminUserShow from '../services/adminUsers/Show';
import AdminUsersList from '../services/adminUsers/List';
import AdminUserUpdate from '../services/adminUsers/Update';
import AdminUserRemove from '../services/adminUsers/Remove';

export default {
  info: makeServiceRunner(AdminUserInfo),
  show: makeServiceRunner(AdminUserShow, req => req.params),
  list: makeServiceRunner(AdminUsersList),
  update: makeServiceRunner(AdminUserUpdate, req => req.body),
  remove: makeServiceRunner(AdminUserRemove, req => req.body),
};
