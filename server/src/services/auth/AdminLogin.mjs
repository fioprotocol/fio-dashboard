import Sequelize from 'sequelize';

import Base from '../Base';

import { generate } from './authToken';
import { AdminUser } from '../../models';
import X from '../Exception.mjs';

export default class AdminLogin extends Base {
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
      const errorFields = {};
      if (
        !adminUser ||
        (adminUser && (!adminUser.password || !adminUser.checkPassword(password)))
      ) {
        errorFields.email = 'INVALID_CREDENTIALS';
        errorFields.password = 'INVALID_CREDENTIALS';
      }
      if (adminUser && (!adminUser.tfaSecret || !adminUser.tfaValidate(tfaToken))) {
        errorFields.tfaToken = 'INVALID';
      }

      throw new X({
        code: 'AUTHENTICATION_FAILED',
        fields: errorFields,
      });
    }

    await AdminUser.update(
      { lastLogIn: Sequelize.fn('now') },
      { where: { id: adminUser.id } },
    );

    return {
      data: {
        jwt: generate({ id: adminUser.id }),
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
