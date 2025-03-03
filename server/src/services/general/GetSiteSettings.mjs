import Sequelize from 'sequelize';

import logger from '../../logger';
import Base from '../Base';
import X from '../Exception';
import { FioApiUrl, Var } from '../../models';

import { VARS_KEYS } from '../../config/constants';
import { ABIS_VAR_KEY } from '../../external/fio.mjs';
import { FIO_API_URLS_TYPES } from '../../constants/fio.mjs';

export default class GetSiteSettings extends Base {
  static get validationRules() {
    return {
      tz: 'string',
    };
  }
  async execute({ tz }) {
    let formattedData = {};
    try {
      const varsData = await Var.findAll({
        where: {
          key: {
            [Sequelize.Op.in]: [
              VARS_KEYS.VOTE_FIO_HANDLE,
              VARS_KEYS.MOCKED_PUBLIC_KEYS_FOR_BOARD_VOTE,
              ABIS_VAR_KEY,
            ],
          },
        },
      });

      formattedData = varsData.reduce((acc, varData) => {
        const key = varData.key;

        if (!acc[key]) {
          acc[key] = varData.value;
        }

        return acc;
      }, {});
    } catch (error) {
      logger.error(`Get site settings: ${error}`);
      throw new X({
        code: 'SERVER_ERROR',
        fields: {
          getSiteSettings: 'SERVER_ERROR',
        },
      });
    }

    try {
      const apiUrls = await FioApiUrl.getApiUrls({
        type: FIO_API_URLS_TYPES.DASHBOARD_API,
        tz,
        supportsCors: true,
      });

      formattedData[FIO_API_URLS_TYPES.DASHBOARD_API] = apiUrls;
    } catch (error) {
      logger.error(`Get apiUrls ${FIO_API_URLS_TYPES.DASHBOARD_API}: ${error}`);
    }

    return { data: formattedData };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return [];
  }
}
