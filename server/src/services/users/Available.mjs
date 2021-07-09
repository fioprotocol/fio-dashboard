import Base from '../Base';
import X from '../Exception';

import { User } from '../../models';

export default class UserAvailable extends Base {
  static get validationRules() {
    return {
      email: ['required', 'trim', 'email', 'to_lc'],
    };
  }
  async execute({ email }) {
    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (user) {
      throw new X({
        code: 'NOT_UNIQUE',
        fields: {
          email: 'NOT_UNIQUE',
        },
      });
    }

    return {
      data: true,
    };
  }

  static get paramsSecret() {
    return ['email'];
  }

  static get resultSecret() {
    return [];
  }
}
