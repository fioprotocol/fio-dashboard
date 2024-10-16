import Base from '../Base';
import { FioApiUrl } from '../../models';
import { ADMIN_ROLES_IDS } from '../../config/constants.js';
import { DEFAULT_LIMIT, MAX_LIMIT } from '../../constants/general.mjs';

export default class FioApiUrlsList extends Base {
  static get requiredPermissions() {
    return [ADMIN_ROLES_IDS.ADMIN, ADMIN_ROLES_IDS.SUPER_ADMIN];
  }

  static get validationRules() {
    return {
      offset: ['integer', { min_number: 0 }],
      limit: ['integer', { min_number: 0 }, { max_number: MAX_LIMIT }],
    };
  }

  async execute({ limit = DEFAULT_LIMIT, offset = 0 }) {
    const apiUrls = await FioApiUrl.findAll({
      order: [['rank', 'ASC']],
      limit,
      offset,
    });
    const maxCount = await FioApiUrl.count();

    return {
      data: {
        apiUrls: apiUrls.map(item => item.json()),
        maxCount,
      },
    };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return [];
  }
}
