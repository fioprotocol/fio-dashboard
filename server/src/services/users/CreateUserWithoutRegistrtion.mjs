import Base from '../Base';
import X from '../Exception';

import { User, Notification, ReferrerProfile, Wallet } from '../../models';
import { WALLET_CREATED_FROM } from '../../config/constants';

export default class CreateUserWithoutRegistrtion extends Base {
  static get validationRules() {
    return {
      data: [
        'required',
        {
          nested_object: {
            publicKey: ['string', 'required'],
            refCode: ['string', 'required'],
            timeZone: ['string'],
          },
        },
      ],
    };
  }

  async execute({ data: { publicKey, refCode, timeZone } }) {
    const existingWallet = await Wallet.findOneWhere({
      publicKey,
      edgeId: null,
    });

    if (existingWallet && existingWallet.userId) {
      const user = await User.info(existingWallet.userId);

      if (!user) {
        throw new X({
          code: 'AUTHENTICATION_FAILED',
          fields: {
            user: 'NOT FOUND',
          },
        });
      }

      if (timeZone) {
        await user.update({ timeZone });
      }

      return {
        data: user.json(),
      };
    }

    const refProfile = await ReferrerProfile.findOneWhere({
      code: refCode,
    });

    const refProfileId = refProfile ? refProfile.id : null;

    const user = new User({
      status: User.STATUS.ACTIVE,
      refProfileId,
      isOptIn: false,
      timeZone,
      userProfileType: User.USER_PROFILE_TYPE.WITHOUT_REGISTRATION,
    });

    await user.save();

    await new Notification({
      type: Notification.TYPE.INFO,
      contentType: Notification.CONTENT_TYPE.ACCOUNT_CREATE,
      userId: user.id,
      data: { pagesToShow: ['/myfio'] },
    }).save();

    const newWallet = new Wallet({
      name: 'My FIO wallet',
      from: WALLET_CREATED_FROM.WITHOUT_REGISTRATION,
      publicKey,
      userId: user.id,
    });

    await newWallet.save();

    return {
      data: user.json(),
    };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return ['data'];
  }
}
