import Base from '../Base';
import X from '../Exception';

import { AdminUser } from '../../models';
import { ADMIN_ROLES_IDS } from '../../config/constants.js';

export default class AdminUserChangePassword extends Base {
  static get requiredPermissions() {
    return [ADMIN_ROLES_IDS.ADMIN, ADMIN_ROLES_IDS.SUPER_ADMIN];
  }

  static get validationRules() {
    return {
      data: [
        'required',
        {
          nested_object: {
            newPassword: ['string'],
            oldPassword: ['string'],
          },
        },
      ],
    };
  }

  async execute({ data }) {
    const { newPassword, oldPassword } = data;

    const adminUser = await AdminUser.findActive(this.context.adminId);

    if (!adminUser) {
      throw new X({
        code: 'NOT_FOUND',
        fields: {
          id: 'NOT_FOUND',
        },
      });
    }

    if (!adminUser.checkPassword(oldPassword)) {
      throw new X({
        code: 'AUTHENTICATION_FAILED',
        fields: 'INVALID',
      });
    }

    await adminUser.update({ password: newPassword });

    return {
      data: { success: true },
    };
  }

  static get paramsSecret() {
    return ['data.newPassword', 'data.oldPassword'];
  }

  static get resultSecret() {
    return ['data.newPassword', 'data.oldPassword'];
  }
}
