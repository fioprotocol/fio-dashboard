import Base from '../Base';

import { AdminUser, ReferrerProfile, User, Wallet } from '../../models';
import { USER_PROFILE_TYPE, WALLET_CREATED_FROM } from '../../config/constants';

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
            userOption: 'string',
          },
        },
      ],
    };
  }

  async execute({ limit = 25, offset = 0, includeMoreDetailedInfo, filters }) {
    const include = [
      { model: Wallet, as: 'fioWallets' },
      { model: ReferrerProfile, as: 'refProfile', attributes: ['code'] },
      {
        model: ReferrerProfile,
        as: 'affiliateProfile',
        attributes: ['code', 'tpid'],
      },
    ];

    const includeToUsers = [];
    let where = null;

    if (includeMoreDetailedInfo) {
      includeToUsers.push(...include);
    }

    switch (filters.userOption) {
      case 'FAILED_SYNC_WITH_EDGE': {
        const walletIndex = includeToUsers.findIndex(
          item => item.model === Wallet && item.as === 'fioWallets',
        );

        const walletsWhere = { failedSyncedWithEdge: true };

        if (walletIndex !== -1) {
          includeToUsers[walletIndex].where = walletsWhere;
        } else {
          includeToUsers.push({
            model: Wallet,
            as: 'fioWallets',
            where: walletsWhere,
          });
        }
        break;
      }
      case 'EDGE_USERS': {
        where = {
          userProfileType: USER_PROFILE_TYPE.PRIMARY,
        };
        break;
      }
      case 'METAMASK_USERS': {
        where = {
          userProfileType: USER_PROFILE_TYPE.ALTERNATIVE,
        };

        const walletIndex = includeToUsers.findIndex(
          item => item.model === Wallet && item.as === 'fioWallets',
        );

        const walletsWhere = { from: WALLET_CREATED_FROM.METAMASK };

        if (walletIndex !== -1) {
          includeToUsers[walletIndex].where = walletsWhere;
        } else {
          includeToUsers.push({
            model: Wallet,
            as: 'fioWallets',
            where: walletsWhere,
          });
        }
        break;
      }
      case 'WITHOUT_REGISTRATION_USERS': {
        where = {
          userProfileType: USER_PROFILE_TYPE.WITHOUT_REGISTRATION,
        };
        break;
      }
      default:
        null;
    }

    const users = await User.list({
      limit,
      offset,
      include: includeToUsers,
      where,
    });

    const usersCount = await User.usersCount({ where, inculde: includeToUsers });

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
