import Base from '../Base';

import { FreeAddress } from '../../models';

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
    if (name) {
      where.name = name;
    }

    where.publicKey = publicKey;
    where.userId = userId;

    const freeAddressList = await FreeAddress.getItems(where);

    return {
      data: freeAddressList.map(freeAddressItem =>
        FreeAddress.format(freeAddressItem.get({ plain: true })),
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
