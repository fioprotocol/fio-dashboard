import Base from '../Base';
import X from '../Exception';

import emailSender from '../emailSender';
import { templates } from '../../emails/emailTemplate';

import { Action, AdminUser } from '../../models';
import { ADMIN_ROLES_IDS } from '../../config/constants.js';

export default class SendResetPassword extends Base {
  static get requiredPermissions() {
    return [ADMIN_ROLES_IDS.ADMIN, ADMIN_ROLES_IDS.SUPER_ADMIN];
  }

  static get validationRules() {
    return {
      id: ['required', 'string'],
    };
  }

  async execute({ id }) {
    const adminUser = await AdminUser.findByPk(id);

    if (!adminUser.id) {
      throw new X({
        code: 'NOT_FOUND',
        fields: {
          id: 'NOT_FOUND',
          name: 'NOT_FOUND',
        },
      });
    }

    const action = await new Action({
      type: Action.TYPE.RESET_ADMIN_PASSWORD,
      hash: Action.generateHash(),
      data: {
        adminId: adminUser.id,
        email: adminUser.email,
      },
    }).save();

    await emailSender.send(templates.resetAdminPasswordEmail, adminUser.email, {
      hash: action.hash,
    });

    return {
      data: { success: true },
    };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return [];
  }
}
