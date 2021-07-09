import { FIOSDK } from '@fioprotocol/fiosdk';
import { EndPoint } from '@fioprotocol/fiosdk/lib/entities/EndPoint';
import { Transactions } from '@fioprotocol/fiosdk/lib/transactions/Transactions';
import { isDomain } from '../utils';

export default class Fio {
  baseurl = process.env.REACT_APP_FIO_BASE_URL;
  publicFioSDK = null;
  walletFioSDK = null;

  constructor() {
    this.publicFioSDK = new FIOSDK('', '', this.baseurl, window.fetch);
  }

  amountToSUF = amount => FIOSDK.amountToSUF(amount);

  sufToAmount = suf => FIOSDK.SUFToAmount(suf);

  setBaseUrl = () => (Transactions.baseUrl = this.baseurl);

  setWalletFioSdk = keys =>
    (this.walletFioSDK = new FIOSDK(
      keys.private,
      keys.public,
      this.baseurl,
      window.fetch,
    ));

  clearWalletFioSdk = () => (this.walletFioSDK = null);

  logError = e => {
    if (e.errorCode !== 404) console.error(e);
  };

  extractError = json => {
    if (!json) return '';

    return json && json.fields && json.fields[0]
      ? json.fields[0].error
      : json.message;
  };

  availCheck = fioName => {
    this.setBaseUrl();
    return this.publicFioSDK.isAvailable(fioName);
  };

  registrationFee = async (forDomain = false) => {
    if (forDomain) return this.publicFioSDK.getFee(EndPoint.registerFioDomain);
    return this.publicFioSDK.getFee(EndPoint.registerFioAddress);
  };

  register = async (fioName, fee) => {
    if (!this.walletFioSDK) throw new Error('No wallet set.');
    this.setBaseUrl();
    if (isDomain(fioName)) {
      return await this.walletFioSDK.registerFioDomain(fioName, fee);
    }
    return await this.walletFioSDK.registerFioAddress(fioName, fee);
  };

  getBalance = async publicKey => {
    this.setBaseUrl();
    try {
      const { balance } = await this.publicFioSDK.getFioBalance(publicKey);
      return FIOSDK.SUFToAmount(balance);
    } catch (e) {
      this.logError(e);
    }

    return 0;
  };

  getFioNames = async publicKey => {
    this.setBaseUrl();
    try {
      // do not return method to handle errors here
      const res = await this.publicFioSDK.getFioNames(publicKey);
      return res;
    } catch (e) {
      this.logError(e);
    }

    return { fio_addresses: [], fio_domains: [] };
  };

  getPubAddressesForFioAddresses = async fioAddresses => {
    const retResult = {};

    //todo: change to getAllPublicAddresses after fioSDK update;
    const cryptoCurrencies = ['BTC', 'ETH', 'BCH'];
    for (const fioAddress of fioAddresses) {
      const fioAddressRes = [];
      for (const chainCode of cryptoCurrencies) {
        try {
          const {
            public_address: publicAddress,
          } = await this.publicFioSDK.getPublicAddress(
            fioAddress,
            chainCode,
            chainCode,
          );
          fioAddressRes.push({
            publicAddress,
            chainCode,
            tokenCode: chainCode,
          });
        } catch (e) {
          this.logError(e);
        }
      }
      retResult[fioAddress] = fioAddressRes;
    }
    return retResult;
  };
}
