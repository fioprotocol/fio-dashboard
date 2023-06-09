import config from '../../config';
import ApiClient from '../../api/client';

import Fio from '../../api/fio';
import InfuraNfts from '../../api/infura-nfts';

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
  fio: Fio;
  infuraNfts: InfuraNfts;
};

const ApiObj = {
  fio: new Fio(),
  client: apiClient,
  infuraNfts: new InfuraNfts(apiClient),
};

export default ApiObj;
