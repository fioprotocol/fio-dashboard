import config from '../config';
import ApiClient from './client';

import Auth from './auth';
import Users from './users';
import Edge from './edge';
import Notifications from './notifications';
import FioReg from './fio-reg';
import Fio from './fio';
import Account from './account';
import RefProfile from './ref-profile';

const apiClient = new ApiClient(config.apiPrefix);

// todo: temporary fix to prevent CORS
const fetch = window.fetch;
window.fetch = (uri: RequestInfo, opts: RequestInit = {}) => {
  // @ts-ignore todo: fix headers['Content-Type'] type usage
  if (opts.headers && opts.headers['Content-Type']) {
    // @ts-ignore
    delete opts.headers['Content-Type'];
  }
  return fetch(uri, { ...opts });
};

export type Api = {
  auth: Auth;
  users: Users;
  edge: Edge;
  notifications: Notifications;
  fioReg: FioReg;
  fio: Fio;
  account: Account;
  refProfile: RefProfile;
  client: ApiClient;
};

export default {
  auth: new Auth(apiClient),
  users: new Users(apiClient),
  edge: new Edge(),
  notifications: new Notifications(apiClient),
  fioReg: new FioReg(apiClient),
  fio: new Fio(),
  account: new Account(apiClient),
  refProfile: new RefProfile(apiClient),
  client: apiClient,
};
