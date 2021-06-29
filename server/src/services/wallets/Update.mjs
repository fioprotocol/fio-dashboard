import Base from '../Base';

import { Wallet } from '../../models';

export default class WalletsUpdate extends Base {
  static get validationRules() {
    return {
      data: [
        'required',
        {
          list_of_objects: {
            id: 'string',
            name: 'string',
            publicKey: 'string',
          },
        },
      ],
    };
  }

  async execute({ data: fioWallets }) {
    const wallets = await Wallet.list({ userId: this.context.id });

    for (const { id, name, publicKey } of fioWallets) {
      const wallet = wallets.find(({ edgeId }) => edgeId === id);
      if (wallet) {
        await wallet.update({ name, publicKey });
        continue;
      }

      const newWallet = new Wallet({
        edgeId: id,
        name,
        publicKey,
        userId: this.context.id,
      });

      await newWallet.save();
    }

    return {
      data: { success: true },
    };
  }

  static get paramsSecret() {
    return ['data'];
  }

  static get resultSecret() {
    return [];
  }
}
