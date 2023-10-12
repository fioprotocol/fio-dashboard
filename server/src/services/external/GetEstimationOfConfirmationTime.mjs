import EtherScan from '../../external/ether-scan.mjs';
import logger from '../../logger';
import Base from '../Base';
import X from '../Exception.mjs';

export default class GetEstimationOfConfirmationTime extends Base {
  static get validationRules() {
    return {
      gasPrice: ['string', 'required'],
    };
  }
  async execute({ gasPrice }) {
    try {
      const res = await new EtherScan().getEstimationOfConfirmationTime({
        gasPrice,
      });

      return { data: res };
    } catch (e) {
      logger.error(
        `[Service GetEstimationOfConfirmationTime] Get Estimation Of Confirmation Time error: ${e}`,
      );
      throw new X({
        code: 'SERVER_ERROR',
        fields: {
          estimationOfConfirmationTime: 'SERVER_ERROR',
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
