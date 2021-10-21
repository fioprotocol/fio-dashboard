import Base from '../Base';

import { Wallet } from '../../models';

export default class WalletsUpdate extends Base {
  static get validationRules() {
    return {
      data: [
        'required',
        {
          list_of_objects: {
            edgeId: 'string',
            name: 'string',
            publicKey: 'string',
          },
        },
      ],
    };
  }

  async execute({ data: fioWallets }) {
    const wallets = await Wallet.list({ userId: this.context.id });

    for (const { edgeId, name, publicKey } of fioWallets) {
      if (!edgeId) continue;

      const wallet = wallets.find(({ edgeId: itemEdgeId }) => edgeId === itemEdgeId);
      if (wallet) {
        if (name !== wallet.name || publicKey !== wallet.publicKey)
          await wallet.update({ name, publicKey });

        continue;
      }

      const newWallet = new Wallet({
        edgeId,
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
