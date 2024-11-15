import Sequelize from 'sequelize';

import logger from '../../logger';
import Base from '../Base';
import X from '../Exception';
import { Var } from '../../models';

import { VARS_KEYS } from '../../config/constants';

export default class GetSiteSettings extends Base {
  async execute() {
    try {
      const varsData = await Var.findAll({
        where: {
          key: {
            [Sequelize.Op.in]: [
              VARS_KEYS.VOTE_FIO_HANDLE,
              VARS_KEYS.MOCKED_PUBLIC_KEYS_FOR_BOARD_VOTE,
            ],
          },
        },
      });

      const formattedData = varsData.reduce((acc, varData) => {
        const key = varData.key;

        if (!acc[key]) {
          acc[key] = varData.value;
        }

        return acc;
      }, {});

      return { data: formattedData };
    } catch (error) {
      logger.error(`Get site settings: ${error}`);
      throw new X({
        code: 'SERVER_ERROR',
        fields: {
          getSiteSettings: 'SERVER_ERROR',
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
