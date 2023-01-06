import Base from '../Base';
import X from '../Exception';
import { AdminUser, User } from '../../models';
import { getDetailedUsersInfo } from '../../utils/user.mjs';

export default class UsersDetailedInfo extends Base {
  static get requiredPermissions() {
    return [AdminUser.ROLE.ADMIN];
  }

  static get validationRules() {
    return {
      id: ['required', 'string'],
    };
  }

  async execute({ id }) {
    const user = await User.findUser(id);

    if (!user) {
      throw new X({
        code: 'NOT_FOUND',
        fields: {
          id: 'NOT_FOUND',
        },
      });
    }

    return {
      data: await getDetailedUsersInfo(user),
    };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return ['*'];
  }
}
