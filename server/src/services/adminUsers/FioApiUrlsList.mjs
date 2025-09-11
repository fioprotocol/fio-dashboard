import Base from '../Base';
import { FioApiUrl, Var } from '../../models';
import { ADMIN_ROLES_IDS } from '../../config/constants.js';

import { VARS_KEYS } from '../../config/constants.js';

export default class FioApiUrlsList extends Base {
  static get requiredPermissions() {
    return [ADMIN_ROLES_IDS.ADMIN, ADMIN_ROLES_IDS.SUPER_ADMIN];
  }

  async execute() {
    const apiUrls = await FioApiUrl.findAll({
      order: [['rank', 'DESC']],
    });

    const blockedApiUrlsList = await Var.getValByKey(VARS_KEYS.API_URLS_BLOCKED);
    const blockedApiUrlsListArray = JSON.parse(blockedApiUrlsList);

    const filteredApiUrls = apiUrls.map(item => {
      const itemJson = item.json();
      const isBlocked = blockedApiUrlsListArray.some(blockedUrl =>
        item.url.startsWith(blockedUrl),
      );
      return isBlocked ? { ...itemJson, isBlocked: true } : itemJson;
    });

    return {
      data: {
        apiUrls: filteredApiUrls,
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
