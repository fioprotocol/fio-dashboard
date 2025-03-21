import Base from '../Base';

import { Wallet, Nonce } from '../../models';
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
      nonce: [
        'required',
        {
          nested_object: {
            signatures: ['required', { list_of: 'string' }],
            challenge: ['required', 'string'],
          },
        },
      ],
    };
  }

  async execute({ data: { name, edgeId, publicKey, from, data }, nonce }) {
    if (!(await Nonce.verify({ ...nonce, userId: this.context.id }))) {
      throw new X({
        code: 'AUTHENTICATION_FAILED',
        fields: {},
      });
    }

    if (await Wallet.findOneWhere({ userId: this.context.id, publicKey })) {
      throw new X({
        code: 'NOT_UNIQUE',
        fields: {
          publicKey: 'NOT_UNIQUE',
        },
      });
    }

    const deletedWallet = await Wallet.findOne({
      where: { userId: this.context.id, edgeId: edgeId || null, publicKey },
      paranoid: false,
    });

    if (deletedWallet) {
      await deletedWallet.restore();
      deletedWallet.data = data;
      deletedWallet.name = name;
      await deletedWallet.save();

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
    return ['data', 'nonce'];
  }

  static get resultSecret() {
    return ['data'];
  }
}
