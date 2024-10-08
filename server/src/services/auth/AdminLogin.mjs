import Sequelize from 'sequelize';

import Base from '../Base';

import { generate } from './authToken';
import { AdminUser } from '../../models';
import X from '../Exception.mjs';
import { AUTH_TYPE } from '../../tools.mjs';

export default class AuthAdminLogin extends Base {
  static get validationRules() {
    return {
      data: [
        'required',
        {
          nested_object: {
            email: ['required', 'trim', 'email', 'to_lc'],
            password: 'required',
            tfaToken: 'required',
          },
        },
      ],
    };
  }

  async execute({ data: { email, password, tfaToken } }) {
    const adminUser = await AdminUser.findOneWhere({
      email,
      statusId: AdminUser.STATUS.ACTIVE,
    });

    if (
      !adminUser ||
      !adminUser.password ||
      !adminUser.tfaSecret ||
      !adminUser.checkPassword(password) ||
      !adminUser.tfaValidate(tfaToken)
    ) {
      const error_fields = {};
      if (!adminUser) error_fields.email = 'NOT_FOUND';
      if (adminUser && (!adminUser.password || !adminUser.checkPassword(password)))
        error_fields.password = 'INVALID';
      if (adminUser && (!adminUser.tfaSecret || !adminUser.tfaValidate(tfaToken)))
        error_fields.tfaToken = 'INVALID';

      throw new X({
        code: 'AUTHENTICATION_FAILED',
        fields: error_fields,
      });
    }

    await AdminUser.update(
      { lastLogIn: Sequelize.fn('now') },
      { where: { id: adminUser.id } },
    );

    return {
      data: {
        jwt: generate({ type: AUTH_TYPE.ADMIN, id: adminUser.id }),
      },
    };
  }

  static get paramsSecret() {
    return ['data.email', 'data.password', 'data.tfaToken'];
  }

  static get resultSecret() {
    return ['data.jwt'];
  }
}
