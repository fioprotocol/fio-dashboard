import { fioApi } from '../../external/fio';
import { getROE } from '../../external/roe';
import logger from '../../logger';
import Base from '../Base';
import { FioRegApi } from '../../external/fio-reg';
import { FIO_ACTIONS } from '../../config/constants';

export default class Prices extends Base {
  async execute() {
    const pricing = {
      nativeFio: {
        domain: null,
        address: null,
        renewDomain: null,
        addBundles: null,
      },
      usdtRoe: null,
    };
    try {
      const registrationAddressFeePromise = fioApi.registrationFee();
      const registrationDomainFeePromise = fioApi.registrationFee(true);
      const renewDomainFeePromise = fioApi.getFee(FIO_ACTIONS.renewFioDomain);
      const addBundlesFeePromise = fioApi.getFee(FIO_ACTIONS.addBundledTransactions);

      const roe = await getROE();
      pricing.usdtRoe = roe;
      pricing.nativeFio.address = await registrationAddressFeePromise;
      pricing.nativeFio.domain = await registrationDomainFeePromise;
      pricing.nativeFio.renewDomain = await renewDomainFeePromise;
      pricing.nativeFio.addBundles = await addBundlesFeePromise;
    } catch (e) {
      logger.error(`Get prices from reg site error: ${e}`);
    }
    return {
      data: { pricing },
    };
  }

  // todo: check if we could use reg api for this
  async executeRegApi() {
    try {
      const res = await FioRegApi.prices();

      return { data: res };
    } catch (e) {
      logger.error(`Get prices from reg site error: ${e}`);
    }
    return {
      data: {},
    };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return [];
  }
}
