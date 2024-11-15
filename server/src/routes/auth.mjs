import { authCheck, makeServiceRunner, authCheckSimple, AUTH_TYPE } from '../tools';

import AuthAlternateAuthenticate from '../services/auth/AlternateAuthenticate.mjs';
import AuthAuthGuestAuthenticate from '../services/auth/GuestAuthenticate.mjs';
import AuthCreate from '../services/auth/Create';
import AuthCheck from '../services/auth/Check';
import AuthCheckSimple from '../services/auth/CheckSimple';
import AuthNonce from '../services/auth/Nonce';
import AuthUsername from '../services/auth/Username';
import AuthAdminCreate from '../services/auth/AdminCreate';
import AuthCheckAdmin from '../services/auth/CheckAdmin.mjs';
import AuthCheckGuest from '../services/auth/CheckGuest.mjs';
import AdminLogin from '../services/auth/AdminLogin.mjs';
import AuthAdminCreateCheck from '../services/auth/AdminCreateCheck.mjs';
import AuthAdminResetPassword from '../services/auth/AdminResetPassword.mjs';
import AuthAdminResetPasswordCheck from '../services/auth/AdminResetPasswordCheck.mjs';
import AuthGenerateNonce from '../services/auth/GenerateNonce.mjs';
import AuthCheckResolver from '../services/auth/CheckResolver.mjs';

export default {
  async checkUser(req, res, next) {
    return await authCheck(req, res, next, {
      services: { [AUTH_TYPE.USER]: AuthCheck },
      resolver: AuthCheckResolver,
    });
  },
  async checkUserOptional(req, res, next) {
    return await authCheck(req, res, next, {
      services: { [AUTH_TYPE.USER]: AuthCheck },
      resolver: AuthCheckResolver,
      isOptional: true,
    });
  },
  async checkGuestOptional(req, res, next) {
    return await authCheck(req, res, next, {
      services: { [AUTH_TYPE.GUEST]: AuthCheckGuest },
      resolver: AuthCheckResolver,
      isOptional: true,
    });
  },
  async checkAdmin(req, res, next) {
    return await authCheck(req, res, next, {
      services: { [AUTH_TYPE.ADMIN]: AuthCheckAdmin },
      resolver: AuthCheckResolver,
    });
  },
  async checkUserOrGuest(req, res, next) {
    return await authCheck(req, res, next, {
      services: {
        [AUTH_TYPE.USER]: AuthCheck,
        [AUTH_TYPE.GUEST]: AuthCheckGuest,
      },
      resolver: AuthCheckResolver,
    });
  },
  async checkUserOrGuestOptional(req, res, next) {
    return await authCheck(req, res, next, {
      services: {
        [AUTH_TYPE.USER]: AuthCheck,
        [AUTH_TYPE.GUEST]: AuthCheckGuest,
      },
      resolver: AuthCheckResolver,
      isOptional: true,
    });
  },
  async checkSimple(req, res, next) {
    return await authCheckSimple(req, res, next, AuthCheckSimple);
  },
  create: makeServiceRunner(AuthCreate, req => req.body),
  nonce: makeServiceRunner(AuthNonce, req => req.query),
  generateNonce: makeServiceRunner(AuthGenerateNonce),
  username: makeServiceRunner(AuthUsername, req => req.params),
  guestAuth: makeServiceRunner(AuthAuthGuestAuthenticate, req => ({
    token: req.header('Authorization'),
  })),
  alternateAuth: makeServiceRunner(AuthAlternateAuthenticate, req => req.body),
  adminCreate: makeServiceRunner(AuthAdminCreate, req => req.body),
  adminCreateCheck: makeServiceRunner(AuthAdminCreateCheck, req => req.query),
  adminResetPassword: makeServiceRunner(AuthAdminResetPassword, req => req.body),
  adminResetPasswordCheck: makeServiceRunner(
    AuthAdminResetPasswordCheck,
    req => req.query,
  ),
  adminLogin: makeServiceRunner(AdminLogin, req => req.body),
};
