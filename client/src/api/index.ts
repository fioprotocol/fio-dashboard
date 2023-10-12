import config from '../config';
import ApiClient from './client';

import Account from './account';
import Admin from './admin';
import Auth from './auth';
import ChainCode from './chain-code';
import Contacts from './contacts';
import DomainsWatchlist from './domains-watchilst';
import Edge from './edge';
import EtherScan from './ether-scan';
import Fio from './fio';
import FioHistory from './fio-history';
import FioReg from './fio-reg';
import General from './general';
import GeneratePdfFile from './generatePdf';
import HealthCheck from './health-check';
import InfuraApi from './infura';
import ExternalProviderNfts from './external-provider-nfts';
import Notifications from './notifications';
import Orders from './orders';
import Payments from './payments';
import RefProfile from './ref-profile';
import Registration from './registration';
import Twitter from './twitter';
import Users from './users';
import Vars from './vars';
import WrapStatus from './wrap-status';

import { log } from '../util/general';

const apiClient = new ApiClient(config.apiPrefix);

// todo: temporary fix to prevent CORS
const fetch = window.fetch;
window.fetch = async (uri: RequestInfo | URL, opts: RequestInit = {}) => {
  // @ts-ignore todo: fix headers['Content-Type'] type usage
  if (opts.headers && opts.headers['Content-Type']) {
    // @ts-ignore
    delete opts.headers['Content-Type'];
  }
  try {
    return await fetch(uri, { ...opts });
  } catch (err) {
    log.error(err);
  }
};

export type Api = {
  account: Account;
  admin: Admin;
  auth: Auth;
  chainCode: ChainCode;
  client: ApiClient;
  contacts: Contacts;
  domainsWatchlist: DomainsWatchlist;
  edge: Edge;
  etherScan: EtherScan;
  fioReg: FioReg;
  fio: Fio;
  general: General;
  generatePdfFile: GeneratePdfFile;
  healthCheck: HealthCheck;
  infura: InfuraApi;
  externalProviderNfts: ExternalProviderNfts;
  notifications: Notifications;
  orders: Orders;
  payments: Payments;
  refProfile: RefProfile;
  registration: Registration;
  twitter: Twitter;
  users: Users;
  vars: Vars;
  wrapStatus: WrapStatus;
};

const apis = {
  account: new Account(apiClient),
  admin: new Admin(apiClient),
  auth: new Auth(apiClient),
  chainCode: new ChainCode(apiClient),
  client: apiClient,
  contacts: new Contacts(apiClient),
  domainsWatchlist: new DomainsWatchlist(apiClient),
  edge: new Edge(),
  etherScan: new EtherScan(apiClient),
  fioHistory: new FioHistory(),
  fioReg: new FioReg(apiClient),
  fio: new Fio(),
  general: new General(apiClient),
  generatePdfFile: new GeneratePdfFile(apiClient),
  healthCheck: new HealthCheck(apiClient),
  infura: new InfuraApi(apiClient),
  externalProviderNfts: new ExternalProviderNfts(apiClient),
  notifications: new Notifications(apiClient),
  orders: new Orders(apiClient),
  payments: new Payments(apiClient),
  refProfile: new RefProfile(apiClient),
  registration: new Registration(apiClient),
  twitter: new Twitter(apiClient),
  users: new Users(apiClient),
  vars: new Vars(apiClient),
  wrapStatus: new WrapStatus(apiClient),
};

export default apis;
