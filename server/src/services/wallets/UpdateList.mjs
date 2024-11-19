import Base from '../Base';

import { Wallet } from '../../models';
import X from '../Exception';

export default class WalletsUpdateList extends Base {
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
      archivedWalletIds: { list_of: 'string' },
    };
  }

  async execute({ data: fioWallets, archivedWalletIds = [] }) {
    const wallets = await Wallet.list({ userId: this.context.id }, false);

    for (const { edgeId, name, publicKey } of fioWallets) {
      if (!edgeId) continue;

      const wallet = wallets.find(({ edgeId: itemEdgeId }) => edgeId === itemEdgeId);
      if (wallet) {
        if (publicKey !== wallet.publicKey) await wallet.update({ publicKey });
        if (wallet.deletedAt) await wallet.restore();

        continue;
      }

      const walletWithExistingPublicKey = wallets.find(
        wallet => wallet.publicKey === publicKey,
      );

      if (walletWithExistingPublicKey) {
        await walletWithExistingPublicKey.update({ failedSyncedWithEdge: true });
        throw new X({
          code: 'NOT_UNIQUE',
          fields: {
            publicKey: 'NOT_UNIQUE',
          },
        });
      } else {
        const newWallet = new Wallet({
          edgeId,
          name,
          publicKey,
          userId: this.context.id,
        });
        await newWallet.save();
      }
    }

    if (archivedWalletIds.length > 0) {
      for (const edgeWalletId of archivedWalletIds) {
        const wallet = wallets.find(
          ({ edgeId: itemEdgeId }) => edgeWalletId === itemEdgeId,
        );
        if (wallet && !wallet.deletedAt) {
          await wallet.destroy();
        }
      }
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
