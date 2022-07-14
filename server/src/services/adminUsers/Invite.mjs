import Base from '../Base';
import X from '../Exception';

import emailSender from '../emailSender';
import { templates } from '../../emails/emailTemplate';

import { Action, AdminUser } from '../../models';
import { USER_ROLES_IDS } from '../../config/constants.js';

export default class Invite extends Base {
  static get requiredPermissions() {
    return [USER_ROLES_IDS.ADMIN, USER_ROLES_IDS.SUPER_ADMIN];
  }

  static get validationRules() {
    return {
      email: ['required', 'string'],
    };
  }

  async execute({ email }) {
    const existAdminUser = await AdminUser.findOne({
      where: {
        email,
      },
    });

    if (existAdminUser && existAdminUser.id) {
      throw new X({
        code: 'INVITATION_FAILED',
        fields: {
          email: 'USER_ALREADY_EXIST',
        },
      });
    }

    const invitedAdminUser = new AdminUser({
      email,
    });
    await invitedAdminUser.save();

    const action = await new Action({
      type: Action.TYPE.CONFIRM_ADMIN_EMAIL,
      hash: Action.generateHash(),
      data: {
        adminId: invitedAdminUser.id,
        email: invitedAdminUser.email,
      },
    }).save();

    await emailSender.send(templates.confirmAdminEmail, email, {
      hash: action.hash,
    });

    return {
      data: { success: true },
    };
  }

  static get paramsSecret() {
    return ['email'];
  }

  static get resultSecret() {
    return [];
  }
}
