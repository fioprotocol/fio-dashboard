import Base from '../Base';
import X from '../Exception';

import { FioAccountProfile } from '../../models';
import { ADMIN_ROLES_IDS, FIO_ACCOUNT_TYPES } from '../../config/constants.js';

export default class FioAccountProfileCreate extends Base {
  static get requiredPermissions() {
    return [ADMIN_ROLES_IDS.ADMIN, ADMIN_ROLES_IDS.SUPER_ADMIN];
  }

  static get validationRules() {
    return {
      name: ['required', 'string'],
      actor: ['required', 'string'],
      permission: ['required', 'string'],
      accountType: ['required', 'string'],
    };
  }

  async execute({ name, actor, permission, accountType }) {
    const existProfile = await FioAccountProfile.findOne({
      where: {
        name,
        actor,
        permission,
        accountType,
      },
    });

    if (existProfile && existProfile.id) {
      throw new X({
        code: 'CREATION_FAILED',
        fields: {
          name: 'PROFILE_ALREADY_EXIST',
          actor: 'PROFILE_ALREADY_EXIST',
          permission: 'PROFILE_ALREADY_EXIST',
        },
      });
    }

    const fioAccountProfileWithExistingType = await FioAccountProfile.findOneWhere({
      accountType,
    });

    if (fioAccountProfileWithExistingType) {
      await fioAccountProfileWithExistingType.update({
        ...fioAccountProfileWithExistingType,
        accountType: null,
      });
    }

    const createdProfile = new FioAccountProfile({
      name,
      actor,
      permission,
      accountType: FIO_ACCOUNT_TYPES[accountType] || null,
    });
    await createdProfile.save();

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
