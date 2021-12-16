import Base from '../Base';

import { NewDeviceTwoFactor } from '../../models';

export default class NewDeviceTwoFactorCheckRejected extends Base {
  static get validationRules() {
    return {
      voucherId: ['required', 'string'],
    };
  }
  async execute({ voucherId }) {
    const rejectedVoucher = await NewDeviceTwoFactor.getItem({
      voucherId,
      status: NewDeviceTwoFactor.STATUS.REJECTED,
    });

    return { data: !!rejectedVoucher };
  }

  static get paramsSecret() {
    return ['voucherId'];
  }

  static get resultSecret() {
    return [];
  }
}
