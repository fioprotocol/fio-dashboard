import logger from '../../logger';
import Base from '../Base';
import { FioRegApi } from '../../external/fio-reg';

export default class Domains extends Base {
  async execute() {
    try {
      const res = await FioRegApi.domains();

      return { data: res };
    } catch (e) {
      logger.error(`Get domains from reg site error: ${e}`);
    }
    return {
      data: { domains: [] },
    };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return [];
  }
}
