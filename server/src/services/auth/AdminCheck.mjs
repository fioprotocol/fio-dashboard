import Base from '../Base';
import X from '../Exception';
import { verify } from './authToken';

import { AdminUser } from '../../models';

export default class AuthAdminCheck extends Base {
  static get validationRules() {
    return {
      token: ['required', 'token'],
    };
  }

  async execute({ token }) {
    try {
      const userData = await verify(token);

      const adminUser = await AdminUser.findActive(userData.id);

      if (!adminUser) throw new Error('NOT_VALID_USER');

      return {
        adminId: adminUser.id,
        role: adminUser.roleId,
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
    return ['token'];
  }

  static get resultSecret() {
    return [];
  }
}
