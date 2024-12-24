import Base from '../Base';
import { FioApiUrl } from '../../models';
import { ADMIN_ROLES_IDS } from '../../config/constants.js';

export default class FioApiUrlsList extends Base {
  static get requiredPermissions() {
    return [ADMIN_ROLES_IDS.ADMIN, ADMIN_ROLES_IDS.SUPER_ADMIN];
  }

  async execute() {
    const apiUrls = await FioApiUrl.findAll({
      order: [['rank', 'DESC']],
    });

    return {
      data: {
        apiUrls: apiUrls.map(item => item.json()),
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
