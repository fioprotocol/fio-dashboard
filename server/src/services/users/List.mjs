import Base from '../Base';

import { AdminUser, ReferrerProfile, User, Wallet } from '../../models';

export default class UsersList extends Base {
  static get requiredPermissions() {
    return [AdminUser.ROLE.ADMIN];
  }

  static get validationRules() {
    return {
      offset: 'string',
      limit: 'string',
      includeMoreDetailedInfo: 'boolean',
      filters: [
        {
          nested_object: {
            failedSyncedWithEdge: 'string',
          },
        },
      ],
    };
  }

  async execute({ limit = 25, offset = 0, includeMoreDetailedInfo, filters }) {
    const include = [
      { model: ReferrerProfile, as: 'refProfile', attributes: ['code'] },
      {
        model: ReferrerProfile,
        as: 'affiliateProfile',
        attributes: ['code', 'tpid'],
      },
    ];

    const includeToUsers = [];
    const hasFilters = !!filters.failedSyncedWithEdge;

    if (includeMoreDetailedInfo) {
      includeToUsers.push(...include);
    }

    if (filters.failedSyncedWithEdge) {
      includeToUsers.push({
        model: Wallet,
        as: 'fioWallets',
        where: { failedSyncedWithEdge: true },
      });
    }

    const users = await User.list({
      limit,
      offset,
      include: includeToUsers,
    });

    const usersCount = hasFilters ? users.length : await User.usersCount();

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
