import Base from '../Base';

import { User, Wallet } from '../../models';
import X from '../Exception';

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
      throw new X({
        code: 'AUTHENTICATION_FAILED',
        fields: {
          username: 'INVALID',
        },
      });
    }

    if (await Wallet.findOneWhere({ userId: user.id, publicKey })) {
      throw new X({
        code: 'NOT_UNIQUE',
        fields: {
          publicKey: 'NOT_UNIQUE',
        },
      });
    }

    const newWallet = new Wallet({
      edgeId,
      name,
      publicKey,
      userId: user.id,
      from,
    });
    await newWallet.save();

    return {
      data: { success: true },
    };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return [];
  }
}
