import Base from '../Base';

import { Wallet } from '../../models';
import X from '../Exception';

export default class WalletsUpdate extends Base {
  static get validationRules() {
    return {
      name: 'string',
      data: 'any_object',
      publicKey: 'string',
    };
  }

  async execute({ name, publicKey, data }) {
    const wallet = await Wallet.findOneWhere({ publicKey, userId: this.context.id });
    if (!wallet) {
      throw new X({
        code: 'NOT_FOUND',
        fields: {
          publicKey: 'NOT_FOUND',
        },
      });
    }

    wallet.name = name;
    if (data) {
      wallet.data = data;
    }
    await wallet.save();

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
