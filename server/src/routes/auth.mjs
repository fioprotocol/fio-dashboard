import { authCheck, makeServiceRunner } from '../tools';

import AuthCreate from '../services/auth/Create';
import AuthCheck from '../services/auth/Check';
import AuthNonce from '../services/auth/Nonce';
import AuthUsername from '../services/auth/Username';
import AdminAuthCreate from '../services/auth/AdminCreate';
import AdminAuthCheck from '../services/auth/AdminCheck';

export default {
  create: makeServiceRunner(AuthCreate, req => req.body),
  nonce: makeServiceRunner(AuthNonce, req => req.query),
  username: makeServiceRunner(AuthUsername, req => req.params),

  async check(req, res, next) {
    return await authCheck(req, res, next, AuthCheck);
  },

  adminCreate: makeServiceRunner(AdminAuthCreate, req => req.body),
  async checkAdminAuth(req, res, next) {
    return await authCheck(req, res, next, AdminAuthCheck, true);
  },
};
