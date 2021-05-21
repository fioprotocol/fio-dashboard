import { FIOSDK } from '@fioprotocol/fiosdk';
import { EndPoint } from '@fioprotocol/fiosdk/lib/entities/EndPoint';

export default class Fio {
  baseurl = process.env.REACT_APP_FIO_BASE_URL;
  publicFioSDK = null;

  constructor() {
    this.publicFioSDK = new FIOSDK('', '', this.baseurl, window.fetch);
  }

  availCheck = fioName => {
    return this.publicFioSDK.isAvailable(fioName);
  };

  registrationFee = async (forDomain = false) => {
    if (forDomain) return this.publicFioSDK.getFee(EndPoint.registerFioDomain);
    return this.publicFioSDK.getFee(EndPoint.registerFioAddress);
  };

  getBalance = async publicKey => {
    try {
      const { balance } = await this.publicFioSDK.getFioBalance(publicKey);
      return balance;
    } catch (e) {
      console.error(e);
    }

    return 0;
  };
}
