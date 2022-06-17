import Base from '../Base';
import X from '../Exception';

import emailSender from '../emailSender';
import { templates } from '../../emails/emailTemplate';

import { AdminUser, Action } from '../../models';

export default class Invite extends Base {
  static get validationRules() {
    return {
      inviteEmail: ['required', 'string'],
    };
  }

  async execute({ inviteEmail }) {
    if (
      await AdminUser.findOneWhere({
        email: inviteEmail,
      })
    ) {
      throw new X({
        code: 'NOT_UNIQUE',
        fields: {
          inviteEmail: 'NOT_UNIQUE',
        },
      });
    }

    const adminUser = new AdminUser({
      email: inviteEmail,
    });

    await adminUser.save();

    const action = await new Action({
      type: Action.TYPE.CONFIRM_ADMIN_EMAIL,
      hash: Action.generateHash(),
      data: {
        adminId: adminUser.id,
        email: adminUser.email,
      },
    }).save();

    await emailSender.send(templates.confirmAdminEmail, inviteEmail, {
      hash: action.hash,
    });

    return {
      data: { success: true },
    };
  }

  static get paramsSecret() {
    return ['inviteEmail'];
  }

  static get resultSecret() {
    return [];
  }
}
