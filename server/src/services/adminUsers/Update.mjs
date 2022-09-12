import Base from '../Base';
import X from '../Exception';

import { AdminUser } from '../../models';
import { ADMIN_ROLES_IDS } from '../../config/constants.js';

export default class AdminUserUpdate extends Base {
  static get requiredPermissions() {
    return [ADMIN_ROLES_IDS.ADMIN, ADMIN_ROLES_IDS.SUPER_ADMIN];
  }

  static get validationRules() {
    return {
      data: [
        'required',
        {
          nested_object: {
            email: { min_length: 2 },
          },
        },
      ],
    };
  }

  async execute({ data }) {
    const adminUser = await AdminUser.findActive(this.context.adminId);

    if (!adminUser) {
      throw new X({
        code: 'NOT_FOUND',
        fields: {
          id: 'NOT_FOUND',
        },
      });
    }

    await adminUser.update(data);

    return {
      data: adminUser.json(),
    };
  }

  static get paramsSecret() {
    return ['data.email'];
  }

  static get resultSecret() {
    return ['data.email'];
  }
}
