import Base from '../Base';
import X from '../Exception';

import { FioAccountProfile } from '../../models';
import { ADMIN_ROLES_IDS } from '../../config/constants.js';

export default class FioAccountProfileCreate extends Base {
  static get requiredPermissions() {
    return [ADMIN_ROLES_IDS.ADMIN, ADMIN_ROLES_IDS.SUPER_ADMIN];
  }

  static get validationRules() {
    return {
      name: ['required', 'string'],
      actor: ['required', 'string'],
      permission: ['required', 'string'],
    };
  }

  async execute({ name, actor, permission }) {
    const existProfile = await FioAccountProfile.findOne({
      where: {
        name,
        actor,
        permission,
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

    const createdProfile = new FioAccountProfile({
      name,
      actor,
      permission,
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
