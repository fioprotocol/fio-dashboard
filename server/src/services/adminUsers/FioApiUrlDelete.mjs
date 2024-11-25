import Base from '../Base';
import X from '../Exception';

import { FioApiUrl } from '../../models';
import { ADMIN_ROLES_IDS } from '../../config/constants.js';

export default class FioApiUrlDelete extends Base {
  static get requiredPermissions() {
    return [ADMIN_ROLES_IDS.ADMIN, ADMIN_ROLES_IDS.SUPER_ADMIN];
  }

  static get validationRules() {
    return {
      id: ['required', 'string'],
    };
  }

  async execute({ id }) {
    const fioApiUrl = await FioApiUrl.findByPk(id);

    if (!fioApiUrl) {
      throw new X({
        code: 'NOT_FOUND',
        fields: {
          id: 'NOT_FOUND',
        },
      });
    }

    await fioApiUrl.destroy({ force: true });

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
