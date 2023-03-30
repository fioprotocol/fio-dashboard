import Base from '../Base';
import X from '../Exception';

import { Var } from '../../models';

import { VARS_KEYS } from '../../config/constants';

export default class VarsUpdateEmail extends Base {
  static get validationRules() {
    return {
      value: 'boolean',
    };
  }

  async execute({ value }) {
    const key = VARS_KEYS.IS_OUTBOUND_EMAIL_STOP;
    const data = await Var.findOne({
      where: {
        key,
      },
    });

    if (!data) {
      throw new X({
        code: 'NOT_FOUND',
        fields: {
          value: 'NOT_FOUND',
        },
      });
    }

    await Var.setValue(key, value);

    return {
      data,
    };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return [];
  }
}
