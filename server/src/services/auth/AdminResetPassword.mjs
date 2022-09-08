import Base from '../Base';
import X from '../Exception';

import { Action, AdminUser } from '../../models';
import { ACTION_EPX_TIME } from '../actions/Submit.mjs';

export default class AuthAdminCreate extends Base {
  static get validationRules() {
    return {
      data: [
        'required',
        {
          nested_object: {
            email: ['required', 'trim', 'email', 'to_lc'],
            password: 'required',
            hash: 'required',
          },
        },
      ],
    };
  }

  async execute({ data: { email, password, hash } }) {
    const emailToken = await Action.findOneWhere({
      hash,
      type: Action.TYPE.RESET_ADMIN_PASSWORD,
    });
    const adminUser = await AdminUser.findOneWhere({
      email,
    });

    if (!emailToken || !adminUser) {
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

    if (emailToken.data.adminId !== adminUser.id) {
      throw new X({
        code: 'EMAIL_TOKEN_NOT_VALID',
        fields: {
          email: 'INVALID',
        },
      });
    }

    await AdminUser.update(
      {
        password,
      },
      { where: { id: adminUser.id } },
    );
    await emailToken.destroy({ force: true });

    return {
      data: {
        success: true,
      },
    };
  }

  static get paramsSecret() {
    return ['data.email', 'data.password'];
  }

  static get resultSecret() {
    return [];
  }
}
