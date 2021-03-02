import { makeServiceRunner } from '../tools';

import UsersCreate from '../services/users/Create';
import UsersUpdate from '../services/users/Update';
import UsersInfo from '../services/users/Info';
import ShowInfo from '../services/users/Show';
import UsersResetPassword from '../services/users/ResetPassword';
import UsersList from '../services/users/List';

export default {
  create: makeServiceRunner(UsersCreate, req => req.body),
  update: makeServiceRunner(UsersUpdate, req => req.body),
  info: makeServiceRunner(UsersInfo),
  resetPassword: makeServiceRunner(UsersResetPassword, req => req.body),
  list: makeServiceRunner(UsersList),
  show: makeServiceRunner(ShowInfo, req => req.params),
};
