import { templates } from '../../emails/emailTemplate';
import Base from '../Base';
import X from '../Exception';
import emailSender from '../emailSender';

import { Action, User, Notification, Wallet } from '../../models';

export default class UsersCreate extends Base {
  static get validationRules() {
    return {
      data: [
        'required',
        {
          nested_object: {
            username: ['string'],
            email: ['required', 'trim', 'email', 'to_lc'],
            fioWallets: [
              'required',
              {
                list_of_objects: {
                  id: 'string',
                  name: 'string',
                  publicKey: 'string',
                },
              },
            ],
          },
        },
      ],
    };
  }

  async execute({ data: { username, email, fioWallets } }) {
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
      status: User.STATUS.NEW,
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

    await emailSender.send(templates.createAccount, email);

    await emailSender.send(templates.confirmEmail, email, {
      hash: action.hash,
    });

    await new Notification({
      type: Notification.TYPE.INFO,
      title: 'Account Create',
      message:
        "You're all set to start managing FIO Addresses, Domains, Requests as well as staying",
      userId: user.id,
      data: { pagesToShow: ['/'] },
    }).save();

    for (const { id, name, publicKey } of fioWallets) {
      const newWallet = new Wallet({
        edgeId: id,
        name,
        publicKey,
        userId: user.id,
      });

      await newWallet.save();
    }

    return {
      data: user.json(),
    };
  }

  static get paramsSecret() {
    return ['data.email', 'data.fioWallets', 'data.username'];
  }

  static get resultSecret() {
    return ['data'];
  }
}
