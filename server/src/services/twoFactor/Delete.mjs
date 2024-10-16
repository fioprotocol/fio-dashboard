import Base from '../Base';

import { NewDeviceTwoFactor } from '../../models';

export default class NewDeviceTwoFactorDelete extends Base {
  static get validationRules() {
    return {
      voucherId: ['required', 'string'],
    };
  }

  async execute({ voucherId }) {
    const newDeviceTwoFactor = await NewDeviceTwoFactor.getItem({
      voucherId,
      userId: this.context.id,
    });

    if (!newDeviceTwoFactor) {
      return { data: { success: false, message: 'Not Found' } };
    }

    await newDeviceTwoFactor.destroy({ force: true });

    return { data: { success: true } };
  }

  static get paramsSecret() {
    return ['voucherId'];
  }

  static get resultSecret() {
    return [];
  }
}
