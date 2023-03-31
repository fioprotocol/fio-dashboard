import Base from '../Base';
import X from '../Exception';

import { FioApiUrl } from '../../models';
import { ADMIN_ROLES_IDS } from '../../config/constants.js';

export default class FioApiUrlCreate extends Base {
  static get requiredPermissions() {
    return [ADMIN_ROLES_IDS.ADMIN, ADMIN_ROLES_IDS.SUPER_ADMIN];
  }

  static get validationRules() {
    return {
      rank: ['required', 'string'],
      url: ['required', 'string', 'trim'],
    };
  }

  async execute({ rank, url }) {
    const exist = await FioApiUrl.findOne({
      where: {
        url,
      },
    });

    if (exist && exist.id) {
      throw new X({
        code: 'CREATION_FAILED',
        fields: {
          url: 'API_URL_ALREADY_EXIST',
        },
      });
    }

    const created = new FioApiUrl({
      rank,
      url,
    });
    await created.save();

    return {
      data: { success: true },
    };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return [];
  }
}
