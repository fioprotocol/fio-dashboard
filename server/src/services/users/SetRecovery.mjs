import { templates } from '../../emails/emailTemplate';
import Base from '../Base';
import X from '../Exception';
import emailSender from '../emailSender';

import { Notification, User } from '../../models';

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

    if (user.status === User.STATUS.BLOCKED) {
      throw new X({
        code: 'BLOCKED_USER',
        fields: {
          email: 'BLOCKED_USER',
        },
      });
    }

    user.secretSet = true;
    await user.save();

    try {
      const secretSetNotification = await Notification.getItem({
        action: Notification.ACTION.RECOVERY,
        userId: user.id,
        closeDate: null,
      });
      if (secretSetNotification) {
        secretSetNotification.closeDate = new Date();
        await secretSetNotification.save();
      }
    } catch (e) {
      //
    }

    await emailSender.send(templates.passRecovery, user.email, {
      username: user.username,
      token,
    });

    return {};
  }

  static get paramsSecret() {
    return ['data.token'];
  }

  static get resultSecret() {
    return [];
  }
}
