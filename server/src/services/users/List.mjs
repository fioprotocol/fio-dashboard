import Base from '../Base';

import { AdminUser, User } from '../../models';

export default class UsersList extends Base {
  static get requiredPermissions() {
    return [AdminUser.ROLE.ADMIN];
  }

  static get validationRules() {
    return {
      offset: 'string',
      limit: 'string',
    };
  }

  async execute({ limit = 25, offset = 0 }) {
    const users = await User.list(limit, offset);
    const usersCount = await User.usersCount();

    return {
      data: {
        users: users.map(user => user.json()).filter(user => user.id !== this.context.id),
        maxCount: usersCount,
      },
    };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return ['data[*].email', 'data[*].location'];
  }
}
