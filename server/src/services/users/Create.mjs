import Base from '../Base';
import X from '../Exception';
import emailSender from '../emailSender';

import { Action, User } from '../../models';

export default class UsersCreate extends Base {
  static get validationRules() {
    return {
      data: [
        'required',
        {
          nested_object: {
            username: ['string'],
            email: ['required', 'trim', 'email', 'to_lc'],
            pin: 'required',
            confirmPin: ['required', { equal_to_field: ['pin'] }],
            password: ['required'],
          },
        },
      ],
    };
  }

  async execute({ data: { username, email, pin, password } }) {
    if (await User.findOneWhere({ email })) {
      throw new X({
        code: 'NOT_UNIQUE',
        fields: {
          email: 'NOT_UNIQUE',
        },
      });
    }

    const user = new User({
      username,
      email,
      pin,
      password,
      status: User.STATUS.ACTIVE, // todo: should we set NEW and then activate via email?
    });

    await user.save();

    const action = await new Action({
      type: Action.TYPE.CONFIRM_EMAIL,
      hash: Action.generateHash(),
      data: {
        userId: user.id,
        email: user.email,
      },
    }).save();

    await emailSender.send('confirmEmail', email, {
      hash: action.hash,
    });

    return {
      data: user.json(),
    };
  }

  static get paramsSecret() {
    return ['data.email', 'data.password', 'data.confirmPassword'];
  }

  static get resultSecret() {
    return ['data.email', 'data.location'];
  }
}
