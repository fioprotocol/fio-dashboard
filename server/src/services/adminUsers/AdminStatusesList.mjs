import Base from '../Base';
import { AdminUsersStatus } from '../../models';
import { ADMIN_ROLES_IDS } from '../../config/constants.js';

export default class AdminRolesList extends Base {
  static get requiredPermissions() {
    return [ADMIN_ROLES_IDS.ADMIN, ADMIN_ROLES_IDS.SUPER_ADMIN];
  }

  async execute() {
    const adminStatuses = await AdminUsersStatus.list();

    return {
      data: adminStatuses.map(adminStatus => adminStatus.json()),
    };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return [];
  }
}
