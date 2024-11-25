import Base from '../Base';
import X from '../Exception';

import { AdminUser } from '../../models';
import { ADMIN_ROLES_IDS } from '../../config/constants.js';

export default class AdminUserRemove extends Base {
  static get requiredPermissions() {
    return [ADMIN_ROLES_IDS.ADMIN, ADMIN_ROLES_IDS.SUPER_ADMIN];
  }

  static get validationRules() {
    return {
      adminUserId: 'string',
    };
  }

  async execute({ adminUserId }) {
    const adminUser = await AdminUser.findByPk(adminUserId);

    if (!adminUser) {
      throw new X({
        code: 'NOT_FOUND',
        fields: {
          id: 'NOT_FOUND',
        },
      });
    }

    await adminUser.destroy({ force: true });

    return { data: { success: true } };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return [];
  }
}
