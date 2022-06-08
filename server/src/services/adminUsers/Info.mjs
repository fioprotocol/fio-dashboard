import Base from '../Base';
import X from '../Exception';

import { AdminUser } from '../../models';

export default class AdminUserInfo extends Base {
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
