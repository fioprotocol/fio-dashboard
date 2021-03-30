import Base from '../Base';
import X from '../Exception';
import { generate } from './authToken';

import { User } from '../../models';

export default class AuthCreate extends Base {
  static get validationRules() {
    return {
      data: [
        'required',
        {
          nested_object: {
            email: ['required', 'trim', 'email', 'to_lc'],
            pin: ['integer'],
            password: ['string'],
          },
        },
      ],
    };
  }

  async execute({ data: { email, password, pin } }) {
    const user = await User.findOneWhere({ email });

    if (pin && (!user || !user.checkPin(pin))) {
      throw new X({
        code: 'AUTHENTICATION_FAILED',
        fields: {
          email: 'INVALID',
          pin: 'INVALID',
        },
      });
    }

    if (password && (!user || !user.checkPassword(password))) {
      throw new X({
        code: 'AUTHENTICATION_FAILED',
        fields: {
          email: 'INVALID',
          pin: 'INVALID',
        },
      });
    }

    if (user.status !== User.STATUS.ACTIVE) {
      throw new X({
        code: 'NOT_ACTIVE_USER',
        fields: {
          status: 'NOT_ACTIVE_USER',
        },
      });
    }

    return {
      data: {
        jwt: generate({ id: user.id }),
      },
    };
  }

  static get paramsSecret() {
    return ['data.email', 'data.pin'];
  }

  static get resultSecret() {
    return ['data.jwt'];
  }
}
