import Base from '../Base';
import X from '../Exception';

import { PASSWORDS } from '../../config/constants';

export default class AuthCheckSimple extends Base {
  static get validationRules() {
    return {
      type: 'string',
      password: 'string',
    };
  }

  async execute({ password, type }) {
    if (PASSWORDS[type] !== password) {
      throw new X({
        code: 'PERMISSION_DENIED',
        fields: {
          password: 'WRONG_PASSWORD',
        },
      });
    } else {
      return true;
    }
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return [];
  }
}
