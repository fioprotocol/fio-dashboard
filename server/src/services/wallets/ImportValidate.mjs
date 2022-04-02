import Base from '../Base';

import { Wallet } from '../../models';
import X from '../Exception';

export default class ImportValidate extends Base {
  static get validationRules() {
    return {
      publicKey: ['required', 'string'],
    };
  }

  async execute({ publicKey }) {
    const wallet = await Wallet.findOneWhere({ userId: this.context.id, publicKey });
    if (wallet && wallet.id) {
      throw new X({
        code: 'NOT_UNIQUE',
        fields: {
          publicKey: 'NOT_UNIQUE',
        },
        data: { name: wallet.name },
      });
    }

    return { data: { valid: true } };
  }

  static get paramsSecret() {
    return ['data'];
  }

  static get resultSecret() {
    return ['data'];
  }
}
