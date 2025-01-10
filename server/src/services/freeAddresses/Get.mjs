import Base from '../Base';

import { FreeAddress } from '../../models';
import X from '../Exception.mjs';

export default class GetFreeAddress extends Base {
  static get validationRules() {
    return {
      publicKey: ['string'],
    };
  }

  async execute({ publicKey }) {
    const { id: userId } = this.context;

    if (!publicKey && !userId) {
      throw new X({
        code: 'REQUEST_FAILED',
        fields: {
          name: 'NOT_PROVIDED',
          publicKey: 'NOT_PROVIDED',
          userId: 'NOT_PROVIDED',
        },
      });
    }

    const params = {};

    if (publicKey) params.publicKey = publicKey;
    if (userId) params.userId = userId;

    const freeAddressList = await FreeAddress.getItems(params);

    return {
      data: freeAddressList.map(freeAddressItem =>
        FreeAddress.formatMinimal(freeAddressItem.get({ plain: true })),
      ),
    };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return [];
  }
}
