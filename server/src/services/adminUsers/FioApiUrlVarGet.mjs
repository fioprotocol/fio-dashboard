import Base from '../Base';

import { Var } from '../../models';
import { ADMIN_ROLES_IDS, VARS_KEYS } from '../../config/constants.js';

export default class FioApiUrlVarGet extends Base {
  static get requiredPermissions() {
    return [ADMIN_ROLES_IDS.ADMIN, ADMIN_ROLES_IDS.SUPER_ADMIN];
  }

  static get validationRules() {
    return {
      key: [
        'string',
        {
          one_of: [VARS_KEYS.API_URLS_MIN_VERSION, VARS_KEYS.API_URLS_DYNAMIC_FETCH],
        },
      ],
    };
  }

  async execute({ key }) {
    if (key) {
      return {
        data: {
          [key]: await Var.getValByKey(key),
        },
      };
    }

    const minVersion = await Var.getValByKey(VARS_KEYS.API_URLS_MIN_VERSION);
    const dFetch = await Var.getValByKey(VARS_KEYS.API_URLS_DYNAMIC_FETCH);

    return {
      data: {
        [`${VARS_KEYS.API_URLS_MIN_VERSION}`]: minVersion,
        [`${VARS_KEYS.API_URLS_DYNAMIC_FETCH}`]: dFetch,
      },
    };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return [];
  }
}
