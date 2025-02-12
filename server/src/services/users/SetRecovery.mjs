import { templates } from '../../emails/emailTemplate';
import Base from '../Base';
import X from '../Exception';
import emailSender from '../emailSender';

import { User, ActionLimit } from '../../models';

export default class UsersSetRecovery extends Base {
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

    user.secretSet = true;
    await User.update({ secretSet: true }, { where: { id: user.id } });

    const actionCompleted = await ActionLimit.executeWithinLimit(
      user.id,
      ActionLimit.ACTION.SEND_RECOVERY_EMAIL,
      async () => {
        await emailSender.send(templates.passRecovery, user.email, {
          username: user.username,
          token,
        });
      },
    );

    if (!actionCompleted) {
      throw new X({
        code: 'LIMIT_EXCEEDED',
        fields: {
          email: 'TOO_MANY_RECOVERY_EMAILS',
        },
      });
    }

    return {};
  }

  static get paramsSecret() {
    return ['data.token'];
  }

  static get resultSecret() {
    return [];
  }
}
