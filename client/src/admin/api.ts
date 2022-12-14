import config from '../config';
import ApiClient from '../api/client';

import Auth from '../api/auth';
import Admin from '../api/admin';

const apiClient = new ApiClient(config.apiPrefix);

// todo: temporary fix to prevent CORS
const fetch = window.fetch;
window.fetch = (uri: RequestInfo | URL, opts: RequestInit = {}) => {
  // @ts-ignore todo: fix headers['Content-Type'] type usage
  if (opts.headers && opts.headers['Content-Type']) {
    // @ts-ignore
    delete opts.headers['Content-Type'];
  }
  return fetch(uri, { ...opts });
};

export type Api = {
  admin: Admin;
  auth: Auth;
  client: ApiClient;
};

const ApiObj = {
  client: apiClient,
  admin: new Admin(apiClient),
  auth: new Auth(apiClient),
};

export default ApiObj;
