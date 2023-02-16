import { templates } from '../../emails/emailTemplate';
import Base from '../Base';
import X from '../Exception';
import emailSender from '../emailSender';
import marketingMailchimp from '../../external/marketing-mailchimp';

import { Action, User, Notification, ReferrerProfile, Wallet } from '../../models';

export default class UsersCreate extends Base {
  static get validationRules() {
    return {
      data: [
        'required',
        {
          nested_object: {
            username: ['string', 'to_lc'],
            email: ['required', 'trim', 'email', 'to_lc'],
            fioWallets: [
              'required',
              {
                list_of_objects: {
                  edgeId: 'string',
                  name: 'string',
                  publicKey: 'string',
                },
              },
            ],
            refCode: ['string'],
            stateData: ['any_object'],
            addEmailToPromoList: ['required', 'integer', { number_between: [0, 1] }],
          },
        },
      ],
    };
  }

  async execute({
    data: { username, email, fioWallets, refCode, stateData, addEmailToPromoList },
  }) {
    if (await User.findOneWhere({ email })) {
      throw new X({
        code: 'NOT_UNIQUE',
        fields: {
          email: 'NOT_UNIQUE',
        },
      });
    }

    const refProfile = await ReferrerProfile.findOneWhere({
      code: refCode,
    });

    const refProfileId = refProfile ? refProfile.id : null;

    const user = new User({
      username,
      email,
      status: User.STATUS.NEW,
      refProfileId,
      isOptIn: !!addEmailToPromoList,
    });

    await user.save();

    const action = await new Action({
      type: Action.TYPE.CONFIRM_EMAIL,
      hash: Action.generateHash(),
      data: {
        userId: user.id,
        email: user.email,
        state: stateData,
      },
    }).save();

    if (addEmailToPromoList) {
      await marketingMailchimp.addEmailToPromoList(email);
    }

    await emailSender.send(templates.createAccount, email);

    await emailSender.send(templates.confirmEmail, email, {
      hash: action.hash,
      refCode,
    });

    await new Notification({
      type: Notification.TYPE.INFO,
      contentType: Notification.CONTENT_TYPE.ACCOUNT_CREATE,
      userId: user.id,
      data: { pagesToShow: ['/'] },
    }).save();

    for (const { edgeId, name, publicKey } of fioWallets) {
      const newWallet = new Wallet({
        edgeId,
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
