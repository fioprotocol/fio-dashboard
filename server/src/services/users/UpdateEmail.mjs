import Base from '../Base';
import X from '../Exception';

import { User, FreeAddress } from '../../models';
import logger from '../../logger.mjs';
import { emailToUsername } from '../../utils/user.mjs';

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
      const user = await User.findByPk(this.context.id, {
        where: { status: User.STATUS.ACTIVE },
      });
      let newUsername = null;

      await User.sequelize.transaction(async transaction => {
        const updateParams = { email: newEmail };

        // Update free id
        if (user.userProfileType === User.USER_PROFILE_TYPE.PRIMARY) {
          newUsername = emailToUsername(newEmail);
          updateParams.username = newUsername;
          updateParams.freeId = newUsername;
          await FreeAddress.update(
            { freeId: updateParams.freeId },
            { where: { freeId: user.freeId }, transaction },
          );
        }

        await user.update(updateParams, { transaction });
      });

      return { data: { success: true, newUsername } };
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
