import { authCheck, makeServiceRunner, authCheckSimple } from '../tools';

import AlternateAuthenticate from '../services/auth/AlternateAuthenticate.mjs';
import AuthCreate from '../services/auth/Create';
import AuthCheck from '../services/auth/Check';
import AuthCheckSimple from '../services/auth/CheckSimple';
import AuthCheckOptional from '../services/auth/CheckOptional';
import AuthNonce from '../services/auth/Nonce';
import AuthUsername from '../services/auth/Username';
import AdminAuthCreate from '../services/auth/AdminCreate';
import AdminAuthCheck from '../services/auth/AdminCheck';
import AdminLogin from '../services/auth/AdminLogin.mjs';
import AuthAdminCreateCheck from '../services/auth/AdminCreateCheck.mjs';
import AuthAdminResetPassword from '../services/auth/AdminResetPassword.mjs';
import AuthAdminResetPasswordCheck from '../services/auth/AdminResetPasswordCheck.mjs';
import GenerateNonce from '../services/auth/GenerateNonce.mjs';

export default {
  create: makeServiceRunner(AuthCreate, req => req.body),
  nonce: makeServiceRunner(AuthNonce, req => req.query),
  generateNonce: makeServiceRunner(GenerateNonce),
  username: makeServiceRunner(AuthUsername, req => req.params),
  alternateAuth: makeServiceRunner(AlternateAuthenticate, req => req.body),

  async checkSimple(req, res, next) {
    return await authCheckSimple(req, res, next, AuthCheckSimple);
  },

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
