import Base from '../Base';

import { generate } from './authToken';

import { AdminUser } from '../../models';

export default class AdminInvite extends Base {
  static get validationRules() {
    return {
      adminId: ['required', 'string'],
    };
  }

  async execute({ adminId }) {
    const adminUser = await AdminUser.findById(adminId);

    return {
      data: {
        jwt: generate({ id: adminUser.id }),
      },
    };
  }

  static get paramsSecret() {
    return ['data.adminId'];
  }

  static get resultSecret() {
    return ['data.jwt'];
  }
}
