import { FIOSDK } from '@fioprotocol/fiosdk';

export default class Fio {
  baseurl = process.env.REACT_APP_FIO_BASE_URL;
  publicFioSDK = null;

  constructor() {
    this.publicFioSDK = new FIOSDK('', '', this.baseurl, window.fetch);
  }

  availCheck = fioName => {
    return this.publicFioSDK.isAvailable(fioName);
  };
}
