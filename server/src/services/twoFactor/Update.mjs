import Base from '../Base';

import { NewDeviceTwoFactor } from '../../models';

export default class NewDeviceTwoFactorUpdate extends Base {
  static get validationRules() {
    return {
      id: ['required', 'string'],
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

  async execute({ data, id }) {
    const newDeviceTwoFactor = await NewDeviceTwoFactor.getItem({
      id,
      userId: this.context.id,
    });

    if (!newDeviceTwoFactor) {
      return { data: { success: false, message: 'Not Found' } };
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
