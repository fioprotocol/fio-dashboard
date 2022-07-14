import Base from '../Base';
import X from '../Exception';

import { AdminUser } from '../../models';
import { USER_ROLES_IDS } from '../../config/constants.js';

export default class PersonalInfo extends Base {
  static get requiredPermissions() {
    return [USER_ROLES_IDS.ADMIN, USER_ROLES_IDS.SUPER_ADMIN];
  }

  async execute() {
    if (!this.context.adminId) {
      throw new X({
        code: 'NOT_FOUND',
        fields: {
          id: 'NOT_FOUND',
        },
      });
    }

    const adminUser = await AdminUser.findActive(this.context.adminId);

    if (!adminUser) {
      throw new X({
        code: 'NOT_FOUND',
        fields: {
          id: 'NOT_FOUND',
        },
      });
    }

    const userObj = adminUser.json();

    delete userObj.password;
    delete userObj.tfaSecret;

    return {
      data: userObj,
    };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return ['data.email'];
  }
}
