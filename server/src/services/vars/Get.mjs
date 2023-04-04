import Base from '../Base';
import { Var } from '../../models';

import X from '../Exception.mjs';

export default class VarsGet extends Base {
  static get validationRules() {
    return {
      key: 'string',
    };
  }
  async execute({ key }) {
    const data = await Var.findOne({
      where: {
        key,
      },
    });

    if (!data)
      throw new X({
        code: 'NOT_FOUND',
        fields: {
          id: 'NOT_FOUND',
        },
      });

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
