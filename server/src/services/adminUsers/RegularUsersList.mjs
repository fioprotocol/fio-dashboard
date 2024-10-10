import Base from '../Base';
import { User } from '../../models';
import { ADMIN_ROLES_IDS } from '../../config/constants.js';
import { DEFAULT_LIMIT, MAX_LIMIT } from '../../constants/general.mjs';

export default class RegularUsersList extends Base {
  static get requiredPermissions() {
    return [ADMIN_ROLES_IDS.ADMIN, ADMIN_ROLES_IDS.SUPER_ADMIN];
  }

  static get validationRules() {
    return {
      offset: ['integer', { min_number: 0 }],
      limit: ['integer', { min_number: 0 }, { max_number: MAX_LIMIT }],
    };
  }

  async execute({ limit = DEFAULT_LIMIT, offset = 0 }) {
    const users = await User.list({ limit, offset });
    const usersCount = await User.usersCount();

    return {
      data: {
        users: users.map(user => user.json()),
        maxCount: usersCount,
      },
    };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return ['data.users[*].email'];
  }
}
