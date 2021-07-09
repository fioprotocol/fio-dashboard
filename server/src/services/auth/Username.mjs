import { User } from '../../models';
import Base from '../Base';
import X from '../Exception';

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
      throw new X({
        code: 'AUTHENTICATION_FAILED',
        fields: {
          email: 'INVALID',
        },
      });
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
