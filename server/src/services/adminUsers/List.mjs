import Base from '../Base';
import { AdminUser } from '../../models';

export default class AdminUsersList extends Base {
  static get requiredPermissions() {
    return [AdminUser.ROLE.SUPER_ADMIN];
  }

  async execute() {
    const adminUsers = await AdminUser.list();

    return {
      data: adminUsers
        .map(adminUser => adminUser.json())
        .filter(adminUser => adminUser.id !== this.context.adminId),
    };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return ['data[*].email'];
  }
}
