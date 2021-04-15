import { FIOSDK } from '@fioprotocol/fiosdk';

const fetchJson = (uri, opts = {}) => {
  if (opts.headers) {
    delete opts.headers['Content-Type'];
  }
  return fetch(uri, { ...opts });
};
export default class Fio {
  baseurl = process.env.REACT_APP_FIO_BASE_URL;
  publicFioSDK = null;

  constructor() {
    this.publicFioSDK = new FIOSDK('', '', this.baseurl, fetchJson);
  }

  availCheck = fioName => {
    return this.publicFioSDK.isAvailable(fioName);
  };
}
