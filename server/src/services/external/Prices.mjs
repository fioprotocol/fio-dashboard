import { fioApi } from '../../external/fio';
import { getROE } from '../../external/roe';
import logger from '../../logger';
import Base from '../Base';
import { FioRegApi } from '../../external/fio-reg';

export default class Prices extends Base {
  async execute() {
    const pricing = {
      nativeFio: {
        domain: null,
        address: null,
      },
      usdtRoe: null,
    };
    try {
      const roe = await getROE();
      pricing.usdtRoe = roe;
      pricing.nativeFio.address = await fioApi.registrationFee();
      pricing.nativeFio.domain = await fioApi.registrationFee(true);
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
