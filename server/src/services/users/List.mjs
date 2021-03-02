import Base from '../Base';

import { User } from '../../models';

export default class UsersList extends Base {
  static get requiredPermissions() {
    return [User.ROLE.ADMIN];
  }

  async execute() {
    const users = await User.list();

    return {
      data: users.map(user => user.json()).filter(user => user.id !== this.context.id),
    };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return ['data[*].email', 'data[*].location'];
  }
}
