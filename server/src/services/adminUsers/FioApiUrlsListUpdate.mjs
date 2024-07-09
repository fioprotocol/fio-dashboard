import Base from '../Base';
import X from '../Exception';

import { FioApiUrl } from '../../models';
import { ADMIN_ROLES_IDS } from '../../config/constants.js';

export default class FioApiUrlsListUpdate extends Base {
  static get requiredPermissions() {
    return [ADMIN_ROLES_IDS.ADMIN, ADMIN_ROLES_IDS.SUPER_ADMIN];
  }

  static get validationRules() {
    return {
      data: [
        'required',
        {
          list_of_objects: {
            id: ['required', 'string'],
            createdAt: ['required', 'string'],
            rank: ['required', 'string'],
            type: ['required', 'string'],
            url: ['required', 'string'],
          },
        },
      ],
    };
  }

  async execute({ data }) {
    const updateRankPromises = data.map(
      async fioApiUrl =>
        await FioApiUrl.update({ rank: fioApiUrl.rank }, { where: { id: fioApiUrl.id } }),
    );

    try {
      await Promise.all(updateRankPromises);
    } catch (err) {
      throw new X({
        code: 'SERVER_ERROR',
        fields: {
          id: 'SERVER_ERROR',
        },
      });
    }

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
