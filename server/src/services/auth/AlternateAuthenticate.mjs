import { generate } from './authToken';

import Base from '../Base';
import X from '../Exception';

import { User, Notification, ReferrerProfile, Wallet } from '../../models';

import { DAY_MS } from '../../config/constants.js';
import { AUTH_TYPE } from '../../tools.mjs';

const EXPIRATION_TIME = DAY_MS; // 1 day

export default class AuthAlternateAuthenticate extends Base {
  static get validationRules() {
    return {
      data: [
        'required',
        {
          nested_object: {
            derivationIndex: ['required', 'string'],
            from: ['required', 'string'],
            nonce: ['required', 'string'],
            publicKey: ['required', 'string'],
            referrerCode: ['string'],
            signature: ['required', 'string'],
            timeZone: ['string'],
          },
        },
      ],
    };
  }

  async execute({
    data: { derivationIndex, from, nonce, publicKey, referrerCode, signature, timeZone },
  }) {
    const isVerified = User.verify({ challenge: nonce, publicKey, signature });

    if (!isVerified) {
      throw new X({
        code: 'AUTHENTICATION_FAILED',
        fields: {},
      });
    }

    const generateJwt = userId => {
      const now = new Date();
      return {
        jwt: generate(
          { type: AUTH_TYPE.USER, id: userId },
          new Date(EXPIRATION_TIME + now.getTime()),
        ),
      };
    };

    const existingWallet = await Wallet.findOneWhere({
      publicKey,
      edgeId: null,
    });

    if (existingWallet && existingWallet.userId) {
      const user = await User.info(existingWallet.userId);

      if (!user) {
        throw new X({
          code: 'AUTHENTICATION_FAILED',
          fields: {},
        });
      }

      const responseData = generateJwt(user.id);

      if (timeZone) {
        await user.update({ timeZone });
      }

      return {
        data: responseData,
      };
    }

    const refProfile = await ReferrerProfile.findOneWhere({
      code: referrerCode,
    });

    const refProfileId = refProfile ? refProfile.id : null;

    const user = new User({
      status: User.STATUS.ACTIVE,
      refProfileId,
      isOptIn: false,
      timeZone,
      userProfileType: User.USER_PROFILE_TYPE.ALTERNATIVE,
    });

    await user.save();

    await new Notification({
      type: Notification.TYPE.INFO,
      contentType: Notification.CONTENT_TYPE.ACCOUNT_CREATE,
      userId: user.id,
      data: { pagesToShow: ['/myfio'] },
    }).save();

    const newWallet = new Wallet({
      data: {
        derivationIndex: Number(derivationIndex),
      },
      name: `My FIO wallet`,
      from,
      publicKey,
      userId: user.id,
    });

    await newWallet.save();

    const responseData = generateJwt(user.id);

    return {
      data: { ...responseData, isSignUp: true },
    };
  }

  static get paramsSecret() {
    return ['data.nonce', 'data.signature'];
  }

  static get resultSecret() {
    return ['data.jwt'];
  }
}
