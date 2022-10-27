import config from '../config';
import ApiClient from './client';

import Auth from './auth';
import Edge from './edge';
import Notifications from './notifications';
import FioReg from './fio-reg';
import Fio from './fio';
import FioHistory from './fio-history';
import Account from './account';
import RefProfile from './ref-profile';
import Contacts from './contacts';
import Admin from './admin';
import Payments from './payments';
import Orders from './orders';
import ChainCode from './chain-code';
import GeneratePdfFile from './generatePdf';

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
  edge: Edge;
  notifications: Notifications;
  fioReg: FioReg;
  fio: Fio;
  account: Account;
  refProfile: RefProfile;
  contacts: Contacts;
  orders: Orders;
  client: ApiClient;
  admin: Admin;
  payments: Payments;
  chainCode: ChainCode;
  generatePdfFile: GeneratePdfFile;
};

const apis = {
  auth: new Auth(apiClient),
  edge: new Edge(),
  notifications: new Notifications(apiClient),
  fioReg: new FioReg(apiClient),
  fio: new Fio(),
  fioHistory: new FioHistory(),
  account: new Account(apiClient),
  refProfile: new RefProfile(apiClient),
  contacts: new Contacts(apiClient),
  orders: new Orders(apiClient),
  client: apiClient,
  admin: new Admin(apiClient),
  payments: new Payments(apiClient),
  chainCode: new ChainCode(apiClient),
  generatePdfFile: new GeneratePdfFile(apiClient),
};

export default apis;
