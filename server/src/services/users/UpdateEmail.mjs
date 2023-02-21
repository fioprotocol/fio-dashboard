import Base from '../Base';
import X from '../Exception';

import { User } from '../../models';

export default class UsersUpdateEmail extends Base {
  static get validationRules() {
    return {
      data: {
        nested_object: {
          newEmail: ['required', 'string', 'email', 'to_lc'],
        },
      },
    };
  }

  async execute({ data: { newEmail } }) {
    const user = await User.findById(this.context.id, {
      where: { status: User.STATUS.ACTIVE },
    });

    if (!user) {
      throw new X({
        code: 'NOT_FOUND',
        fields: {
          id: 'NOT_FOUND',
        },
      });
    }

    await user.update({ email: newEmail });

    return { data: { success: true } };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return [];
  }
}
