import config from '../../config';
import ApiClient from '../../api/client';

import ChainCode from '../../api/chain-code';
import Fio from '../../api/fio';
import FioReg from '../../api/fio-reg';
import ExternalProviderNfts from '../../api/external-provider-nfts';
import General from '../../api/general';

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
  chainCode: ChainCode;
  fio: Fio;
  externalProviderNfts: ExternalProviderNfts;
  general: General;
};

const ApiObj = {
  fio: new Fio(apiClient),
  fioReg: new FioReg(apiClient),
  chainCode: new ChainCode(apiClient),
  client: apiClient,
  externalProviderNfts: new ExternalProviderNfts(apiClient),
  general: new General(apiClient),
};

export default ApiObj;
