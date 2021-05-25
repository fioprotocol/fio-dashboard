import { FIOSDK } from '@fioprotocol/fiosdk';
import { EndPoint } from '@fioprotocol/fiosdk/lib/entities/EndPoint';
import { isDomain } from '../utils';

export default class Fio {
  baseurl = process.env.REACT_APP_FIO_BASE_URL;
  publicFioSDK = null;
  walletFioSDK = null;

  constructor() {
    this.publicFioSDK = new FIOSDK('', '', this.baseurl, window.fetch);
  }

  amountToSUF = amount => FIOSDK.amountToSUF(amount);

  setWalletFioSdk = keys =>
    (this.walletFioSDK = new FIOSDK(
      keys.private,
      keys.public,
      this.baseurl,
      window.fetch,
    ));

  clearWalletFioSdk = () => (this.walletFioSDK = null);

  availCheck = fioName => {
    return this.publicFioSDK.isAvailable(fioName);
  };

  registrationFee = async (forDomain = false) => {
    if (forDomain) return this.publicFioSDK.getFee(EndPoint.registerFioDomain);
    return this.publicFioSDK.getFee(EndPoint.registerFioAddress);
  };

  register = async (fioName, fee) => {
    if (!this.walletFioSDK) throw new Error('No wallet set.');
    if (isDomain(fioName)) {
      return await this.walletFioSDK.registerFioDomain(fioName, fee);
    }
    return await this.walletFioSDK.registerFioAddress(fioName, fee);
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
