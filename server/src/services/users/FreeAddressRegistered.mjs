import Base from '../Base';
import X from '../Exception';

import { User, FreeAddress } from '../../models';

export default class FreeAddressRegistered extends Base {
  static get validationRules() {
    return {
      data: [
        'required',
        {
          nested_object: {
            name: ['string'],
          },
        },
      ],
    };
  }

  async execute({ data: { name } }) {
    const user = await User.findActive(this.context.id);

    if (!user) {
      throw new X({
        code: 'NOT_FOUND',
        fields: {
          id: 'NOT_FOUND',
        },
      });
    }

    const freeAddressRecord = new FreeAddress({
      name,
      freeId: user.freeId,
    });
    await freeAddressRecord.save();

    return {
      data: FreeAddress.format(freeAddressRecord.get({ plain: true })),
    };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return [];
  }
}
