import Base from '../Base';
import { User } from '../../models';
import { ADMIN_ROLES_IDS } from '../../config/constants.js';

export default class RegularUsersList extends Base {
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
