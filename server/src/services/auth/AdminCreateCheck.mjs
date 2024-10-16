import Base from '../Base';
import X from '../Exception';

import { Action, AdminUser } from '../../models';
import { ACTION_EPX_TIME } from '../../constants/general.mjs';

export default class AuthAdminCreateCheck extends Base {
  static get validationRules() {
    return {
      email: ['required', 'string'],
      hash: ['required', 'string'],
    };
  }

  async execute({ email, hash }) {
    const emailToken = await Action.findOneWhere({
      hash,
      type: Action.TYPE.CONFIRM_ADMIN_EMAIL,
    });
    const adminUser = await AdminUser.findOneWhere({
      email,
      statusId: AdminUser.STATUS.NEW,
    });

    if (!emailToken || !adminUser || emailToken.data.adminId !== adminUser.id) {
      throw new X({
        code: 'NOT_FOUND',
        fields: {
          email: 'INVALID',
        },
      });
    }

    if (
      new Date().getTime() - new Date(emailToken.createdAt).getTime() >
      ACTION_EPX_TIME
    ) {
      await emailToken.destroy({ force: true });
      throw new X({
        code: 'TOKEN_EXPIRED',
        fields: {
          hash: 'EXPIRED',
        },
      });
    }

    return {
      data: {
        valid: true,
      },
    };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return [];
  }
}
