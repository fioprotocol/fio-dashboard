import Base from '../Base';

import { AdminUser, User } from '../../models';

import { getDetailedUsersInfo } from '../../utils/user.mjs';

export default class UsersDetailedList extends Base {
  static get requiredPermissions() {
    return [AdminUser.ROLE.ADMIN];
  }

  async execute() {
    const users = await User.listAll(0);

    const usersDetailedList = await Promise.all(
      users.map(async user => await getDetailedUsersInfo(user)),
    );

    return {
      data: usersDetailedList,
    };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return [];
  }
}
