import Base from '../Base';
import X from '../Exception';

import { User } from '../../models';

export default class AuthCheck extends Base {
  static get validationRules() {
    return {
      id: ['string', 'required'],
    };
  }

  async execute({ id }) {
    try {
      const user = await User.findActive(id);

      if (!user) {
        throw new Error('NOT_VALID_USER');
      }

      return {
        id: user.id,
      };
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
    return [];
  }

  static get resultSecret() {
    return ['*'];
  }
}
