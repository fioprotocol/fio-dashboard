import Base from '../Base';
import X from '../Exception';

import { AdminUser } from '../../models';
import { USER_ROLES_IDS } from '../../config/constants.js';

export default class AdminUserInfo extends Base {
  static get requiredPermissions() {
    return [USER_ROLES_IDS.ADMIN, USER_ROLES_IDS.SUPER_ADMIN];
  }

  static get validationRules() {
    return {
      id: ['required'],
    };
  }

  async execute({ id }) {
    const user = await AdminUser.profileInfo(id);

    if (!user) {
      throw new X({
        code: 'NOT_FOUND',
        fields: {
          id: 'NOT_FOUND',
        },
      });
    }

    return {
      data: user.json(),
    };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return ['data.email', 'data.location'];
  }
}
