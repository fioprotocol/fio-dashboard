import { templates } from '../../emails/emailTemplate';
import Base from '../Base';
import X from '../Exception';
import emailSender from '../emailSender';
import marketingSendinblue from '../../external/marketing-sendinblue.mjs';

import { User, Notification, ReferrerProfile, Wallet } from '../../models';
import logger from '../../logger.mjs';

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
            addEmailToPromoList: ['required', 'integer', { number_between: [0, 1] }],
          },
        },
      ],
    };
  }

  async execute({ data: { username, email, fioWallets, refCode, addEmailToPromoList } }) {
    try {
      const refProfile = await ReferrerProfile.findOneWhere({
        code: refCode || '',
      });

      const refProfileId = refProfile ? refProfile.id : null;

      const user = new User({
        username,
        email,
        status: User.STATUS.ACTIVE,
        refProfileId,
        isOptIn: !!addEmailToPromoList,
      });

      await user.save();

      if (addEmailToPromoList) {
        await marketingSendinblue.addEmailToPromoList(email);
      }

      await emailSender.send(templates.createAccount, email);

      await new Notification({
        type: Notification.TYPE.INFO,
        contentType: Notification.CONTENT_TYPE.ACCOUNT_CREATE,
        userId: user.id,
        data: { pagesToShow: ['/myfio'] },
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
    } catch (error) {
      logger.error(email, username, error);
      throw new X({
        code: 'SERVER_ERROR',
        fields: {
          registration: 'REGISTRATION_FAILED',
        },
      });
    }
  }

  static get paramsSecret() {
    return ['data.email', 'data.fioWallets', 'data.username'];
  }

  static get resultSecret() {
    return ['data'];
  }
}
