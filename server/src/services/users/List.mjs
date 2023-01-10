import Base from '../Base';

import { AdminUser, ReferrerProfile, User } from '../../models';

export default class UsersList extends Base {
  static get requiredPermissions() {
    return [AdminUser.ROLE.ADMIN];
  }

  static get validationRules() {
    return {
      offset: 'string',
      limit: 'string',
      includeMoreDetailedInfo: 'boolean',
    };
  }

  async execute({ limit = 25, offset = 0, includeMoreDetailedInfo }) {
    const include = [
      { model: ReferrerProfile, as: 'refProfile', attributes: ['code'] },
      {
        model: ReferrerProfile,
        as: 'affiliateProfile',
        attributes: ['code', 'tpid'],
      },
    ];

    const users = await User.list(
      limit,
      offset,
      includeMoreDetailedInfo ? include : null,
    );
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
