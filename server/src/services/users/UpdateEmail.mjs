import Base from '../Base';
import X from '../Exception';

import { User } from '../../models';
import logger from '../../logger.mjs';

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
    try {
      const user = await User.findById(this.context.id, {
        where: { status: User.STATUS.ACTIVE },
      });

      await user.update({ email: newEmail });

      return { data: { success: true } };
    } catch (error) {
      logger.error(error);
      throw new X({
        code: 'SERVER_ERROR',
        fields: {
          id: 'UPDATE_EMAIL_FAILED',
        },
      });
    }
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return [];
  }
}
