import Base from '../Base';
import X from '../Exception';

import { AdminUser } from '../../models';

export default class AuthCheckAdmin extends Base {
  static get validationRules() {
    return {
      id: ['string', 'required'],
    };
  }

  async execute({ id }) {
    try {
      const adminUser = await AdminUser.findActive(id);

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
