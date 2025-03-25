import Base from '../Base';

import { ActionLimit, Wallet, Var } from '../../models';
import X from '../Exception';

import { VARS_KEYS } from '../../config/constants';

export default class WalletsUpdateList extends Base {
  static get validationRules() {
    return {
      data: [
        'required',
        {
          nested_object: {
            fioWallets: [
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
          },
        },
      ],
    };
  }

  async execute({ data: { fioWallets, archivedWalletIds = [] } }) {
    const SET_WALLETS_AMOUNT = await Var.getValByKey(VARS_KEYS.SET_WALLETS_AMOUNT);
    if (fioWallets.length > SET_WALLETS_AMOUNT) {
      throw new X({
        code: 'LIMIT_EXCEEDED',
        fields: {
          fioWallets: 'TOO_MANY_WALLETS',
        },
      });
    }

    const SET_WALLETS_LIMIT = await Var.getValByKey(VARS_KEYS.SET_WALLETS_LIMIT);
    const updateWallets = async () => {
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
          await walletWithExistingPublicKey.update({
            failedSyncedWithEdge: true,
          });
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

      if (archivedWalletIds && archivedWalletIds.length > 0) {
        for (const edgeWalletId of archivedWalletIds) {
          const wallet = wallets.find(
            ({ edgeId: itemEdgeId }) => edgeWalletId === itemEdgeId,
          );
          if (wallet && !wallet.deletedAt) {
            await wallet.destroy();
          }
        }
      }
    };

    const actionCompleted = await ActionLimit.executeWithinLimit(
      this.context.id,
      ActionLimit.ACTION.WALLET_LIST_UPDATE,
      updateWallets,
      { maxCount: SET_WALLETS_LIMIT },
    );

    return {
      data: { success: actionCompleted },
    };
  }

  static get paramsSecret() {
    return ['data'];
  }

  static get resultSecret() {
    return [];
  }
}
