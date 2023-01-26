import { authCheck, makeServiceRunner } from '../tools';

import AuthCreate from '../services/auth/Create';
import AuthCheck from '../services/auth/Check';
import AuthCheckOptional from '../services/auth/CheckOptional';
import AuthNonce from '../services/auth/Nonce';
import AuthUsername from '../services/auth/Username';
import AdminAuthCreate from '../services/auth/AdminCreate';
import AdminAuthCheck from '../services/auth/AdminCheck';
import AdminLogin from '../services/auth/AdminLogin.mjs';
import AuthAdminCreateCheck from '../services/auth/AdminCreateCheck.mjs';
import AuthAdminResetPassword from '../services/auth/AdminResetPassword.mjs';
import AuthAdminResetPasswordCheck from '../services/auth/AdminResetPasswordCheck.mjs';

export default {
  create: makeServiceRunner(AuthCreate, req => req.body),
  nonce: makeServiceRunner(AuthNonce, req => req.query),
  username: makeServiceRunner(AuthUsername, req => req.params),

  async check(req, res, next) {
    return await authCheck(req, res, next, AuthCheck);
  },
  async checkOptional(req, res, next) {
    return await authCheck(req, res, next, AuthCheckOptional);
  },

  adminCreate: makeServiceRunner(AdminAuthCreate, req => req.body),
  adminCreateCheck: makeServiceRunner(AuthAdminCreateCheck, req => req.query),
  adminResetPassword: makeServiceRunner(AuthAdminResetPassword, req => req.body),
  adminResetPasswordCheck: makeServiceRunner(
    AuthAdminResetPasswordCheck,
    req => req.query,
  ),
  adminLogin: makeServiceRunner(AdminLogin, req => req.body),

  async checkAdminAuth(req, res, next) {
    return await authCheck(req, res, next, AdminAuthCheck, true);
  },
};
