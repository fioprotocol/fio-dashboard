import { templates } from '../../emails/emailTemplate';
import Base from '../Base';
import X from '../Exception';
import emailSender from '../emailSender';

import { User } from '../../models';

export default class UsersResendRecovery extends Base {
  static get validationRules() {
    return {
      data: {
        nested_object: {
          token: ['required', 'string'],
        },
      },
    };
  }

  async execute({ data: { token } }) {
    const user = await User.findActive(this.context.id);

    if (!user) {
      throw new X({
        code: 'NOT_FOUND',
        fields: {
          id: 'NOT_FOUND',
        },
      });
    }

    if (user.status === User.STATUS.BLOCKED) {
      throw new X({
        code: 'BLOCKED_USER',
        fields: {
          email: 'BLOCKED_USER',
        },
      });
    }

    await emailSender.send(templates.passRecovery, user.email, {
      username: user.username,
      token,
    });

    return { data: { success: true } };
  }

  static get paramsSecret() {
    return ['data.token'];
  }

  static get resultSecret() {
    return [];
  }
}
