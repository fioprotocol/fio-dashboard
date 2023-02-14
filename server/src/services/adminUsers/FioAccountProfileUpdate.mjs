import Base from '../Base';
import X from '../Exception';

import { FioAccountProfile } from '../../models';
import { ADMIN_ROLES_IDS } from '../../config/constants.js';

export default class FioAccountProfileUpdate extends Base {
  static get requiredPermissions() {
    return [ADMIN_ROLES_IDS.ADMIN, ADMIN_ROLES_IDS.SUPER_ADMIN];
  }

  static get validationRules() {
    return {
      name: ['required', 'string'],
      actor: ['required', 'string'],
      permission: ['required', 'string'],
      id: ['required', 'string'],
      accountType: ['required', 'string'],
    };
  }

  async execute({ id, name, actor, permission, accountType }) {
    const fioAccountProfile = await FioAccountProfile.findById(id);

    if (!fioAccountProfile) {
      throw new X({
        code: 'NOT_FOUND',
        fields: {
          id: 'NOT_FOUND',
          name: 'NOT_FOUND',
        },
      });
    }

    const fioAccountProfileWithExistingType = await FioAccountProfile.findOneWhere({
      accountType,
    });

    if (
      fioAccountProfileWithExistingType &&
      fioAccountProfileWithExistingType.id !== id
    ) {
      await fioAccountProfileWithExistingType.update({
        ...fioAccountProfileWithExistingType,
        accountType: null,
      });
    }

    await fioAccountProfile.update({
      id,
      name,
      actor,
      permission,
      accountType,
    });

    return {
      data: fioAccountProfile.json(),
    };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return [];
  }
}
