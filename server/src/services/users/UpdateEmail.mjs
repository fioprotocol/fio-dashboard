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
          newUsername: ['string'],
        },
      },
    };
  }

  async execute({ data: { newEmail, newUsername } }) {
    try {
      const user = await User.findByPk(this.context.id, {
        where: { status: User.STATUS.ACTIVE },
      });

      const updateParams = { email: newEmail };

      if (newUsername) {
        updateParams.username = newUsername;
      }

      await user.update(updateParams);

      return { data: { success: true } };
    } catch (error) {
      logger.error(error);
      throw new X({
        code: 'SERVER_ERROR',
        fields: {
          update: 'UPDATE_FAILED',
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
