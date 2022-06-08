import Base from '../Base';
import X from '../Exception';

import { AdminUser } from '../../models';

export default class AdminUserRemove extends Base {
  static get requiredPermissions() {
    return [AdminUser.ROLE.SUPER_ADMIN, AdminUser.ROLE.ADMIN];
  }

  static get validationRules() {
    return {
      adminUserId: 'string',
    };
  }

  async execute({ adminUserId }) {
    const adminUser = await AdminUser.findById(adminUserId);

    if (!adminUser) {
      throw new X({
        code: 'NOT_FOUND',
        fields: {
          id: 'NOT_FOUND',
        },
      });
    }

    await adminUser.destroy();

    return { data: { success: true } };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return [];
  }
}
