import Base from '../Base';
import X from '../Exception';

import { Var } from '../../models';

export default class VarsUpdate extends Base {
  static get validationRules() {
    return {
      key: 'string',
      value: 'string',
    };
  }

  async execute({ key, value }) {
    const data = await Var.findOne({
      where: {
        key,
      },
    });

    if (!data) {
      throw new X({
        code: 'NOT_FOUND',
        fields: {
          id: 'NOT_FOUND',
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
