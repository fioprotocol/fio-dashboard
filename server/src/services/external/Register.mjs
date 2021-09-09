import logger from '../../logger';
import { FreeAddress, ReferrerProfile, User } from '../../models/index';
import Base from '../Base';
import { FioRegApi } from '../../external/fio-reg';
import { validate } from '../../external/captcha';
import X from '../Exception';

export default class Register extends Base {
  static get validationRules() {
    return {
      data: {
        nested_object: {
          address: ['required', 'string'],
          publicKey: ['required', 'string'],
          verifyParams: {
            nested_object: {
              pin: ['string'],
              geetest_challenge: ['string'],
              geetest_validate: ['string'],
              geetest_seccode: ['string'],
            },
          },
        },
      },
    };
  }

  async execute({ data: { address, publicKey, verifyParams } }) {
    try {
      if (!verifyParams.pin && !verifyParams.geetest_challenge)
        throw new Error('Verification needed.');

      if (verifyParams.geetest_challenge) await validate(verifyParams);

      if (verifyParams.pin) {
        // todo: other verification method not captcha
      }
    } catch (error) {
      return {
        data: { error: error.message },
      };
    }

    const user = await User.findActive(this.context.id);

    if (!user) {
      throw new X({
        code: 'NOT_FOUND',
        fields: {
          id: 'NOT_FOUND',
        },
      });
    }

    if (user.freeAddresses.length)
      throw new Error('Your account is already have a free address registered.');

    let referralCode;
    let apiToken;
    if (this.context.referrerCode) {
      try {
        const refProfile = await ReferrerProfile.getItem({
          code: this.context.referrerCode,
        });
        referralCode = refProfile.regRefCode;
        apiToken = refProfile.regRefApiToken;
      } catch (e) {
        //
      }
    }

    let res;

    try {
      res = await FioRegApi.register({
        address,
        publicKey,
        referralCode,
        apiToken,
      });
    } catch (error) {
      let message = error.message;
      if (error.response && error.response.body) {
        message = error.response.body.error;
      }
      logger.error(`Register free address error: ${message}`);
      return {
        data: { error: message },
      };
    }

    if (res) {
      const freeAddressRecord = new FreeAddress({
        name: address,
        userId: user.id,
      });
      await freeAddressRecord.save();

      return {
        data: {
          ...res,
          freeAddress: FreeAddress.format(freeAddressRecord.get({ plain: true })),
        },
      };
    }

    throw new Error('Server error. Please try again later.');
  }

  static get paramsSecret() {
    return ['address', 'publicKey', 'verifyParams'];
  }

  static get resultSecret() {
    return [];
  }
}
