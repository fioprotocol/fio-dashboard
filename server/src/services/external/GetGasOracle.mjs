import Infura from '../../external/infura.mjs';
import logger from '../../logger';
import Base from '../Base';
import X from '../Exception.mjs';

export default class GetGasOracle extends Base {
  static get validationRules() {
    return {
      isPolygon: ['boolean'],
      isInfuraProvider: ['boolean'],
    };
  }
  async execute({ isPolygon, isInfuraProvider }) {
    try {
      let res = null;

      if (isInfuraProvider) {
        res = await new Infura().getGasOracle({ isPolygon });
      }

      if (!res) {
        throw new Error('No gas oracle provider');
      }
      return { data: res };
    } catch (e) {
      logger.error(`[Service GetGasOracle] Get Gas Oracle error: ${e}`);
      throw new X({
        code: 'SERVER_ERROR',
        fields: {
          gasOracle: 'SERVER_ERROR',
        },
      });
    }
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return [];
  }
}
