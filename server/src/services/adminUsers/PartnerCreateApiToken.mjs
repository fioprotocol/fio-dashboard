import Base from '../Base';

import { ADMIN_ROLES_IDS } from '../../config/constants.js';
import { generateApiToken } from '../../utils/crypto.mjs';

export default class PartnerCreateApiToken extends Base {
  static get requiredPermissions() {
    return [ADMIN_ROLES_IDS.ADMIN, ADMIN_ROLES_IDS.SUPER_ADMIN];
  }

  static get validationRules() {
    return {};
  }

  async execute() {
    return { data: generateApiToken() };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return [];
  }
}
