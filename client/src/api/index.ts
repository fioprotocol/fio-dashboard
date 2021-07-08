import config from '../config';
import ApiClient from './client';

import Auth from './auth';
import Users from './users';
import Edge from './edge';
import Notifications from './notifications';
import FioReg from './fio-reg';
import Fio from './fio';
import Account from './account';

const apiClient = new ApiClient(config.apiPrefix);

// todo: temporary fix to prevent CORS
const fetch = window.fetch;
window.fetch = (uri: any, opts: any = {}) => {
  if (opts.headers) {
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
  client: apiClient,
};
