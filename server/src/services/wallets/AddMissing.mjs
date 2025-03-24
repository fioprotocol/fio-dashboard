import Base from '../Base';

import { User, Wallet } from '../../models';
import X from '../Exception';

import logger from '../../logger.mjs';

export default class WalletsAddMissing extends Base {
  static get validationRules() {
    return {
      fioWallet: [
        'required',
        {
          nested_object: {
            edgeId: 'string',
            name: 'string',
            publicKey: 'string',
            from: 'string',
          },
        },
      ],
      username: ['string'],
    };
  }

  async execute({ fioWallet: { name, edgeId, publicKey, from }, username }) {
    const user = await User.findOne({
      where: {
        username,
      },
    });

    if (!user) {
      logger.error('WalletsAddMissing: username not found');
      throw new X({
        code: 'AUTHENTICATION_FAILED',
        fields: {},
      });
    }

    const userWallets = await Wallet.findAll({
      raw: true,
      where: { userId: user.id },
      paranoid: false,
    });

    if (userWallets.some(wallet => wallet.deletedAt === null)) {
      logger.error('WalletsAddMissing: auth wallet exists');
      throw new X({
        code: 'AUTHENTICATION_FAILED',
        fields: {},
      });
    }

    if (userWallets.find(wallet => wallet.missing)) {
      logger.error('WalletsAddMissing: missing wallet already exists');
      throw new X({
        code: 'AUTHENTICATION_FAILED',
        fields: {},
      });
    }

    if (userWallets.find(wallet => wallet.publicKey === publicKey)) {
      logger.error('WalletsAddMissing: public key and user id pair not unique');
      throw new X({
        code: 'AUTHENTICATION_FAILED',
        fields: {},
      });
    }

    const newWallet = new Wallet({
      edgeId,
      name,
      publicKey,
      userId: user.id,
      from,
      missing: true,
      deletedAt: new Date(),
    });

    await newWallet.save();

    logger.info('WalletsAddMissing: missing wallet created');
    throw new X({
      code: 'AUTHENTICATION_FAILED',
      fields: {},
    });
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return [];
  }
}
