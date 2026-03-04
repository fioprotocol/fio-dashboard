import Sequelize from 'sequelize';

import Base from '../Base';

import { Wallet, PublicWalletData, Nonce } from '../../models';
import X from '../Exception';

export default class WalletsDelete extends Base {
  static get validationRules() {
    return {
      publicKey: ['required', 'string', 'fio_public_key'],
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

  async execute({ publicKey, nonce }) {
    if (!(await Nonce.verify({ ...nonce, userId: this.context.id }))) {
      throw new X({
        code: 'AUTHENTICATION_FAILED',
        fields: {},
      });
    }

    return await Wallet.sequelize.transaction(async t => {
      const wallet = await Wallet.findOneWhere(
        { publicKey, userId: this.context.id },
        { transaction: t, lock: t.LOCK.UPDATE },
      );

      if (!wallet) {
        throw new X({
          code: 'NOT_FOUND',
          fields: {
            publicKey: 'NOT_FOUND',
          },
        });
      }

      if (wallet.from !== Wallet.CREATED_FROM.LEDGER) {
        const wallets = await Wallet.list(
          {
            userId: this.context.id,
            from: { [Sequelize.Op.ne]: Wallet.CREATED_FROM.LEDGER },
          },
          true,
          { transaction: t, lock: t.LOCK.UPDATE },
        );

        if (wallets.length < 2) {
          throw new X({
            code: 'FORBIDDEN',
            fields: {
              publicKey: 'FORBIDDEN',
            },
          });
        }
      }

      const publicWalletData = await PublicWalletData.findOne({
        where: { walletId: wallet.id },
        transaction: t,
      });

      await wallet.destroy({ transaction: t });

      if (publicWalletData) {
        await publicWalletData.destroy({ force: true, transaction: t });
      }

      return {
        data: { success: true },
      };
    });
  }

  static get paramsSecret() {
    return ['nonce'];
  }

  static get resultSecret() {
    return [];
  }
}
