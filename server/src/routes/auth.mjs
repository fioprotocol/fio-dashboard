import { makeServiceRunner, runService, renderPromiseAsJson } from '../tools';

import AuthCreate from '../services/auth/Create';
import AuthCheck from '../services/auth/Check';
import AuthNonce from '../services/auth/Nonce';
import AuthUsername from '../services/auth/Username';

export default {
  create: makeServiceRunner(AuthCreate, req => req.body),
  nonce: makeServiceRunner(AuthNonce, req => req.query),
  username: makeServiceRunner(AuthUsername, req => req.params),

  async check(req, res, next) {
    const promise = runService(AuthCheck, {
      params: { token: req.header('Authorization') },
    });

    try {
      req.user = await promise;

      return next();
    } catch (e) {
      return renderPromiseAsJson(req, res, promise, { token: '<secret>' });
    }
  },
};
