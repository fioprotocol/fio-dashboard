import { User } from '../../models';
import Base from '../Base';

import { emailToUsername } from '../../utils/user.mjs';

export default class AuthUsername extends Base {
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

    if (!user) {
      return { data: emailToUsername(email) };
    }
    const { username } = user;

    return {
      data: username,
    };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return ['data'];
  }
}
