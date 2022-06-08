import Base from '../Base';
import X from '../Exception';
import { generate } from './authToken';

import { AdminUser } from '../../models';

export default class AuthAdminCreate extends Base {
  static get validationRules() {
    return {
      data: [
        'required',
        {
          nested_object: {
            email: ['required', 'trim', 'email', 'to_lc'],
            password: 'required',
          },
        },
      ],
    };
  }

  async execute({ data: { email, password } }) {
    const adminUser = await AdminUser.findOneWhere({ email });

    if (!adminUser || !adminUser.checkPassword(password)) {
      throw new X({
        code: 'AUTHENTICATION_FAILED',
        fields: {
          email: 'INVALID',
          password: 'INVALID',
        },
      });
    }

    if (adminUser.status !== AdminUser.STATUS.ACTIVE) {
      throw new X({
        code: 'NOT_ACTIVE_USER',
        fields: {
          status: 'NOT_ACTIVE_USER',
        },
      });
    }

    return {
      data: {
        jwt: generate({ id: adminUser.id }),
      },
    };
  }

  static get paramsSecret() {
    return ['data.email', 'data.password'];
  }

  static get resultSecret() {
    return ['data.jwt'];
  }
}
