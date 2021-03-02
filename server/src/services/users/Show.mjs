import Base from '../Base';
import X from '../Exception';

import { User } from '../../models';

export default class UsersShow extends Base {
  static get requiredPermissions() {
    return [User.ROLE.ADMIN];
  }

  static get validationRules() {
    return {
      id: ['required'],
    };
  }

  async execute({ id }) {
    const user = await User.info(id);

    if (!user) {
      throw new X({
        code: 'NOT_FOUND',
        fields: {
          id: 'NOT_FOUND',
        },
      });
    }

    return {
      data: user.json(),
    };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return ['data.email', 'data.location'];
  }
}
