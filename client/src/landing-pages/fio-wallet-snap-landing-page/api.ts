import config from '../../config';
import ApiClient from '../../api/client';

import Fio from '../../api/fio';

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
};

const ApiObj = {
  fio: new Fio(),
  client: apiClient,
};

export default ApiObj;
