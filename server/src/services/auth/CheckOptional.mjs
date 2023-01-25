import Base from '../Base';
import X from '../Exception';
import { verify } from './authToken';

import { User } from '../../models';

export default class AuthCheckOptional extends Base {
  static get validationRules() {
    return {
      token: ['token'],
    };
  }

  async execute({ token }) {
    try {
      if (token) {
        const userData = await verify(token);

        const user = await User.findActive(userData.id);

        if (!user) throw new Error('NOT_VALID_USER');

        return {
          id: user.id,
        };
      } else {
        return null;
      }
    } catch (e) {
      throw new X({
        code: 'PERMISSION_DENIED',
        fields: {
          token: 'WRONG_TOKEN',
        },
      });
    }
  }

  static get paramsSecret() {
    return ['token'];
  }

  static get resultSecret() {
    return ['*'];
  }
}
