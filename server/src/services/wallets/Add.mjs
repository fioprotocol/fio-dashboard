import Base from '../Base';

import { Wallet } from '../../models';
import X from '../Exception';

export default class WalletsAdd extends Base {
  static get validationRules() {
    return {
      data: [
        'required',
        {
          nested_object: {
            edgeId: 'string',
            name: 'string',
            publicKey: 'string',
            from: 'string',
            data: 'any_object',
          },
        },
      ],
    };
  }

  async execute({ data: { name, edgeId, publicKey, from, data } }) {
    if (await Wallet.findOneWhere({ userId: this.context.id, publicKey })) {
      throw new X({
        code: 'NOT_UNIQUE',
        fields: {
          publicKey: 'NOT_UNIQUE',
        },
      });
    }

    const deletedWallet = await Wallet.findOne({
      where: { userId: this.context.id, edgeId, publicKey },
      paranoid: false,
    });

    if (deletedWallet) {
      await deletedWallet.restore();

      return {
        data: Wallet.format(deletedWallet.get({ plain: true })),
      };
    }

    const newWallet = new Wallet({
      edgeId: edgeId || null,
      name,
      publicKey,
      userId: this.context.id,
      from,
      data,
    });
    await newWallet.save();

    return {
      data: Wallet.format(newWallet.get({ plain: true })),
    };
  }

  static get paramsSecret() {
    return ['data'];
  }

  static get resultSecret() {
    return ['data'];
  }
}
