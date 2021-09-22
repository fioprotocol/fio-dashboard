import Base from '../Base';
import X from '../Exception';

import { User, Action } from '../../models';

export default class UsersResetPassword extends Base {
  static get validationRules() {
    return {
      data: {
        nested_object: {
          email: ['required', 'email'],
        },
      },
    };
  }

  async execute({ data: { email } }) {
    const user = await User.findOneWhere({ email });

    if (!user) {
      throw new X({
        code: 'NOT_FOUND',
        fields: {
          email: 'NOT_FOUND',
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

    // eslint-disable-next-line no-unused-vars
    const action = await new Action({
      type: 'resetPassword',
      hash: Action.generateHash(),
      data: {
        userId: user.id,
        email: user.email,
      },
    }).save();

    return {};
  }

  static get paramsSecret() {
    return ['data.email'];
  }

  static get resultSecret() {
    return [];
  }
}
