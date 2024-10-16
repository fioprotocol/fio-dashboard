import Base from '../Base';

import { FreeAddress } from '../../models';
import X from '../Exception.mjs';

export default class GetFreeAddress extends Base {
  static get validationRules() {
    return {
      name: ['string'],
      publicKey: ['string'],
      userId: ['string'],
    };
  }

  async execute({ name, publicKey, userId }) {
    const where = {};

    if (!name && !publicKey && !userId) {
      throw new X({
        code: 'REQUEST_FAILED',
        fields: {
          name: 'NOT_PROVIDED',
          publicKey: 'NOT_PROVIDED',
          userId: 'NOT_PROVIDED',
        },
      });
    }

    if (name) where.name = name;
    if (publicKey) where.publicKey = publicKey;
    if (userId) where.userId = userId;

    const freeAddressList = await FreeAddress.getItems(where);

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
