import Base from '../Base';
import { AdminUser } from '../../models';
import { ADMIN_ROLES_IDS } from '../../config/constants.js';

export default class AdminUsersList extends Base {
  static get requiredPermissions() {
    return [ADMIN_ROLES_IDS.ADMIN, ADMIN_ROLES_IDS.SUPER_ADMIN];
  }

  static get validationRules() {
    return {
      offset: 'string',
      limit: 'string',
    };
  }

  async execute({ limit = 25, offset = 0 }) {
    const adminUsers = await AdminUser.list(limit, offset);
    const usersCount = await AdminUser.usersCount();

    return {
      data: {
        users: adminUsers.map(adminUser => adminUser.json()),
        maxCount: usersCount,
      },
    };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return ['data.users[*].email'];
  }
}
