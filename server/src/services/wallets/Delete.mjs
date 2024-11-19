import Base from '../Base';

import { Wallet, PublicWalletData } from '../../models';
import X from '../Exception';

export default class WalletsDelete extends Base {
  static get validationRules() {
    return {
      publicKey: 'string',
    };
  }

  async execute({ publicKey }) {
    const wallet = await Wallet.findOneWhere({
      publicKey,
      userId: this.context.id,
    });

    if (!wallet) {
      throw new X({
        code: 'NOT_FOUND',
        fields: {
          publicKey: 'NOT_FOUND',
        },
      });
    }

    const publicWalletData = await PublicWalletData.findOne({
      where: {
        walletId: wallet.id,
      },
    });

    await wallet.destroy();

    if (publicWalletData) {
      await publicWalletData.destroy({ force: true });
    }

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
