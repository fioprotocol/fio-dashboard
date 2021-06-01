import logger from '../../logger';
import Base from '../Base';
import { FioRegApi } from '../../external/fio-reg';

const DEFAULT_DOMAIN = { domain: 'fiotestnet' };

export default class Domains extends Base {
  async execute() {
    try {
      const res = await FioRegApi.domains();

      res.domains.push(DEFAULT_DOMAIN);
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
