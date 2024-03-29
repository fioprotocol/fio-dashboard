import Base from '../Base';
import { FioAccountProfile } from '../../models';
import { ADMIN_ROLES_IDS } from '../../config/constants.js';

export default class FioAccountsList extends Base {
  static get requiredPermissions() {
    return [ADMIN_ROLES_IDS.ADMIN, ADMIN_ROLES_IDS.SUPER_ADMIN];
  }

  static get validationRules() {
    return {
      offset: 'string',
      limit: 'string',
    };
  }

  async execute({ limit = 25, offset = 0 }) {
    const accountsProfiles = await FioAccountProfile.list(limit, offset);
    const accountsProfilesCount = await FioAccountProfile.accountsProfilesCount();

    return {
      data: {
        accounts: accountsProfiles,
        maxCount: accountsProfilesCount,
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
