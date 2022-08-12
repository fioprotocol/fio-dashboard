import Base from '../Base';
import X from '../Exception';

import { templates } from '../../emails/emailTemplate';

import emailSender from '../emailSender';
import { Action, User } from '../../models';

export default class UsersUpdateEmailRequest extends Base {
  static get validationRules() {
    return {
      data: {
        nested_object: {
          oldEmail: ['required', 'string', 'email', 'to_lc'],
          newEmail: ['required', 'string', 'email', 'to_lc'],
        },
      },
    };
  }

  async execute({ data: { oldEmail, newEmail } }) {
    const user = await User.findById(this.context.id, {
      where: { status: User.STATUS.ACTIVE },
    });

    if (!user) {
      throw new X({
        code: 'NOT_FOUND',
        fields: {
          id: 'NOT_FOUND',
        },
      });
    }

    await user.update({ status: User.STATUS.NEW_EMAIL_NOT_VERIFIED });

    const action = await new Action({
      type: Action.TYPE.UPDATE_EMAIL,
      hash: Action.generateHash(),
      data: {
        userId: this.context.id,
        oldEmail,
        newEmail,
      },
    }).save();

    const emailData = { hash: action.hash, updateEmail: true };
    await emailSender.send(templates.confirmEmail, user.email, emailData);

    return { data: { success: true } };
  }

  static get paramsSecret() {
    return ['data.id'];
  }

  static get resultSecret() {
    return [];
  }
}
