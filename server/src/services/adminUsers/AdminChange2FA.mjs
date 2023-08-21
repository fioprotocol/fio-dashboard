import Base from '../Base';
import X from '../Exception';

import { AdminUser } from '../../models';
import { ADMIN_ROLES_IDS } from '../../config/constants.js';

import { adminTfaValidate } from '../../tools.mjs';

export default class AdminUserChange2FA extends Base {
  static get requiredPermissions() {
    return [ADMIN_ROLES_IDS.ADMIN, ADMIN_ROLES_IDS.SUPER_ADMIN];
  }

  static get validationRules() {
    return {
      data: [
        'required',
        {
          nested_object: {
            oldTfaToken: ['string'],
            tfaSecret: ['string'],
            tfaToken: ['string'],
          },
        },
      ],
    };
  }

  async execute({ data }) {
    const { oldTfaToken, tfaSecret, tfaToken } = data;

    const adminUser = await AdminUser.findActive(this.context.adminId);

    if (!adminUser) {
      throw new X({
        code: 'NOT_FOUND',
        fields: {
          id: 'NOT_FOUND',
        },
      });
    }

    if (!adminTfaValidate(tfaSecret, tfaToken)) {
      throw new X({
        code: '2FA_TOKEN_IS_NOT_VALID',
        fields: {
          tfaToken: 'INVALID',
        },
      });
    }

    if (!adminUser.tfaValidate(oldTfaToken)) {
      throw new X({
        code: 'AUTHENTICATION_FAILED',
        fields: 'INVALID',
      });
    }

    await adminUser.update({ tfaSecret });

    return {
      data: { success: true },
    };
  }

  static get paramsSecret() {
    return ['data.oldTfaToken', 'data.tfaSecret', 'data.tfaToken'];
  }

  static get resultSecret() {
    return ['data.oldTfaToken', 'data.tfaSecret', 'data.tfaToken'];
  }
}
