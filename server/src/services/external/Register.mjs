import logger from '../../logger';
import { FreeAddress, Nonce, ReferrerProfile, User, Wallet } from '../../models/index';
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
          refCode: ['string'],
          verifyParams: {
            nested_object: {
              walletSignature: ['string'],
              walletChallenge: ['string'],
              geetest_challenge: ['string'],
              geetest_validate: ['string'],
              geetest_seccode: ['string'],
            },
          },
        },
      },
    };
  }

  async execute({ data: { address, publicKey, verifyParams, refCode } }) {
    try {
      if (!verifyParams.walletChallenge && !verifyParams.geetest_challenge)
        throw new Error('Verification needed.');

      if (verifyParams.geetest_challenge) await validate(verifyParams);

      if (verifyParams.walletChallenge) {
        const { walletChallenge, walletSignature } = verifyParams;

        if (!walletSignature)
          throw new X({
            code: 'VERIFICATION_FAILED',
            fields: {
              walletSignature: 'INVALID',
            },
          });

        const wallets = await Wallet.list({ userId: this.context.id });
        let verified = false;
        for (const wallet of wallets) {
          verified = User.verify(walletChallenge, wallet.publicKey, walletSignature);
          if (verified) break;
        }

        if (!verified) {
          throw new X({
            code: 'VERIFICATION_FAILED',
            fields: {
              walletChallenge: 'INVALID',
              walletSignature: 'INVALID',
            },
          });
        }

        const user = await User.findOne({
          where: {
            id: this.context.id,
          },
        });

        const nonce = await Nonce.findOne({
          where: {
            email: user.email,
            value: walletChallenge,
          },
          order: [['createdAt', 'DESC']],
        });

        if (
          !nonce ||
          nonce.value !== walletChallenge ||
          Nonce.isExpired(nonce.createdAt)
        ) {
          nonce && Nonce.isExpired(nonce.createdAt) && (await nonce.destroy());
          throw new X({
            code: 'VERIFICATION_FAILED',
            fields: {
              walletChallenge: 'INVALID',
            },
          });
        }
        await nonce.destroy();
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
    if (refCode) {
      try {
        const refProfile = await ReferrerProfile.getItem({
          code: refCode,
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
