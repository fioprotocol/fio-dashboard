import Base from '../Base';
import X from '../Exception';
import emailSender from '../emailSender';
import config from '../../config';

import { Action } from '../../models';

export default class ActionsSubmit extends Base {
  async validate(data) {
    const action = await Action.findOneWhere({ hash: data.hash });

    if (!action) {
      throw new X({
        code: 'NOT_FOUND',
        fields: {
          hash: 'INVALID',
        },
      });
    }

    const rulesRegistry = {
      resetPassword: {
        password: 'required',
        confirmPassword: ['required', { equal_to_field: ['password'] }],
      },

      confirmEmail: {},
    };

    return this.doValidation(data, {
      ...rulesRegistry[action.type],
      hash: ['required'],
    });
  }

  async execute(data) {
    const action = await Action.findOneWhere({ hash: data.hash });

    await action.run(data);
    await action.destroy();

    if (action.type === Action.TYPE.RESET_PASSWORD) {
      await emailSender.send('resetPasswordSuccess', action.data.email);
    } else if (action.type === Action.TYPE.CONFIRM_EMAIL) {
      await emailSender.send('newUserRegistration', config.mail.adminEmail, {
        email: action.data.email,
      });
    }

    return {};
  }

  static get paramsSecret() {
    return ['password', 'confirmPassword'];
  }

  static get resultSecret() {
    return [];
  }
}
