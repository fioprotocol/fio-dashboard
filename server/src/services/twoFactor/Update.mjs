import Base from '../Base';
import X from '../Exception';

import { NewDeviceTwoFactor } from '../../models';

export default class NewDeviceTwoFactorUpdate extends Base {
  static get validationRules() {
    return {
      voucherId: ['required', 'string'],
      data: [
        'required',
        {
          nested_object: {
            status: ['string'],
            deviceDescription: ['string'],
          },
        },
      ],
    };
  }
  async execute({ data, voucherId }) {
    const newDeviceTwoFactor = await NewDeviceTwoFactor.getItem({
      voucherId,
      userId: this.context.id,
    });

    if (!newDeviceTwoFactor) {
      throw new X({
        code: 'NOT_FOUND',
        fields: {
          id: 'NOT_FOUND',
        },
      });
    }

    await newDeviceTwoFactor.update(data);

    return { data: null };
  }

  static get paramsSecret() {
    return ['voucherId'];
  }

  static get resultSecret() {
    return [];
  }
}
