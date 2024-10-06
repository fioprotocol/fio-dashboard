import Sequelize from 'sequelize';

import Base from '../Base';
import X from '../Exception';
import { generate } from './authToken';

import { Action, AdminUser } from '../../models';
import { adminTfaValidate } from '../../tools.mjs';
import { ACTION_EPX_TIME } from '../../constants/general.mjs';

export default class AuthAdminCreate extends Base {
  static get validationRules() {
    return {
      data: [
        'required',
        {
          nested_object: {
            email: ['required', 'trim', 'email', 'to_lc'],
            password: 'required',
            tfaToken: 'required',
            tfaSecret: 'required',
            hash: 'required',
          },
        },
      ],
    };
  }

  async execute({ data: { email, password, tfaToken, tfaSecret, hash } }) {
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

    if (!adminTfaValidate(tfaSecret, tfaToken)) {
      throw new X({
        code: '2FA_TOKEN_IS_NOT_VALID',
        fields: {
          tfaToken: 'INVALID',
        },
      });
    }

    await AdminUser.update(
      {
        tfaSecret,
        password,
        statusId: AdminUser.STATUS.ACTIVE,
        lastLogIn: Sequelize.fn('now'),
      },
      { where: { id: adminUser.id } },
    );
    await emailToken.destroy({ force: true });

    return {
      data: {
        jwt: generate({ id: adminUser.id }),
      },
    };
  }

  static get paramsSecret() {
    return ['data.email', 'data.password', 'data.tfaToken', 'data.tfaSecret'];
  }

  static get resultSecret() {
    return ['data.jwt'];
  }
}
