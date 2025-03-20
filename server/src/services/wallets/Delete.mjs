import Base from '../Base';

import { Wallet, PublicWalletData, Nonce } from '../../models';
import X from '../Exception';

export default class WalletsDelete extends Base {
  static get validationRules() {
    return {
      publicKey: 'string',
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

    if (!(await Nonce.verify({ ...nonce, userId: this.context.id }))) {
      throw new X({
        code: 'AUTHENTICATION_FAILED',
        fields: {},
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
    return ['nonce'];
  }

  static get resultSecret() {
    return [];
  }
}
