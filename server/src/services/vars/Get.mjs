import Base from '../Base';
import { Var } from '../../models';

import X from '../Exception.mjs';
import { VARS_KEYS } from '../../config/constants';

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

  static get skipLog() {
    // Do not spam with logs for IS_MAINTENANCE false. Show only if IS_MAINTENANCE switched on.
    return (result, params) =>
      result &&
      result.data &&
      result.data.value === 'false' &&
      params &&
      params.key === VARS_KEYS.IS_MAINTENANCE;
  }
}
