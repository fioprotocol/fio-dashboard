import Base from '../Base';

import { Var } from '../../models';
import { ADMIN_ROLES_IDS, VARS_KEYS } from '../../config/constants.js';

export default class FioApiUrlVarUpdate extends Base {
  static get requiredPermissions() {
    return [ADMIN_ROLES_IDS.ADMIN, ADMIN_ROLES_IDS.SUPER_ADMIN];
  }

  static get validationRules() {
    return {
      [`${VARS_KEYS.API_URLS_MIN_VERSION}`]: 'string',
      [`${VARS_KEYS.API_URLS_DYNAMIC_FETCH}`]: 'string',
    };
  }

  async execute(apiUrlsVars) {
    for (const varKey in apiUrlsVars) {
      await Var.setValue(varKey, apiUrlsVars[varKey]);
    }

    return {
      data: { success: true },
    };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return [];
  }
}
