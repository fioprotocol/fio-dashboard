import { templates } from '../../emails/emailTemplate';
import Base from '../Base';
import X from '../Exception';
import emailSender from '../emailSender';

import { Action, User } from '../../models';

const RESEND_ACTION_EXPIRATION_TIME = 1000 * 60 * 60 * 24; // 1 day

export default class UsersResendEmailConfirm extends Base {
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
    const resendAction = await Action.findOneWhere({
      hash: token,
      type: Action.TYPE.RESEND_EMAIL_CONFIRM,
    });

    if (!resendAction)
      throw new X({
        code: 'INVALID_ACTION',
        fields: {
          email: 'INVALID_ACTION',
        },
      });

    if (
      new Date().getTime() - new Date(resendAction.createdAt).getTime() >
      RESEND_ACTION_EXPIRATION_TIME
    ) {
      await resendAction.destroy({ force: true });
      throw new X({
        code: 'INVALID_ACTION',
        fields: {
          email: 'INVALID_ACTION',
        },
      });
    }

    const user = await User.findActive(resendAction.data.userId);

    if (!user) {
      throw new X({
        code: 'NOT_FOUND',
        fields: {
          id: 'NOT_FOUND',
        },
      });
    }

    await resendAction.destroy({ force: true });

    if (user.status === User.STATUS.BLOCKED) {
      throw new X({
        code: 'BLOCKED_USER',
        fields: {
          email: 'BLOCKED_USER',
        },
      });
    }

    const action = await new Action({
      type: Action.TYPE.CONFIRM_EMAIL,
      hash: Action.generateHash(),
      data: {
        userId: user.id,
        email: user.email,
      },
    }).save();

    await emailSender.send(templates.confirmEmail, user.email, {
      hash: action.hash,
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
