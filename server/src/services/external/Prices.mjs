import { convert, fioApi, FIOSDK } from '../../external/fio';
import { getROE } from '../../external/roe';
import logger from '../../logger';
import Base from '../Base';
import { FioRegApi } from '../../external/fio-reg';

export default class Prices extends Base {
  async execute() {
    const pricing = {
      fio: {
        domain: null,
        address: null,
      },
      fioNative: {
        domain: null,
        address: null,
      },
      usdt: {
        domain: null,
        address: null,
      },
    };
    try {
      const roe = await getROE();
      const accountRegFee = await fioApi.registrationFee();
      const accountUsdt = convert(accountRegFee, roe);
      pricing.fioNative.address = accountRegFee;
      pricing.fio.address = FIOSDK.SUFToAmount(accountRegFee);
      pricing.usdt.address = accountUsdt;
      const domainRegFee = await fioApi.registrationFee(true);
      const domainUsdt = convert(domainRegFee, roe);
      pricing.fioNative.domain = domainRegFee;
      pricing.fio.domain = FIOSDK.SUFToAmount(domainRegFee);
      pricing.usdt.domain = domainUsdt;
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
