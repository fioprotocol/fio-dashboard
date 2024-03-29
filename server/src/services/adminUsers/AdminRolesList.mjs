import Base from '../Base';
import { AdminUsersRole } from '../../models';
import { ADMIN_ROLES_IDS } from '../../config/constants.js';

export default class AdminRolesList extends Base {
  static get requiredPermissions() {
    return [ADMIN_ROLES_IDS.ADMIN, ADMIN_ROLES_IDS.SUPER_ADMIN];
  }

  async execute() {
    const adminRoles = await AdminUsersRole.list();

    return {
      data: adminRoles.map(adminRole => adminRole.json()),
    };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return [];
  }
}
