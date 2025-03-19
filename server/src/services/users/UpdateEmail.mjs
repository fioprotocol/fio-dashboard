import Base from '../Base';
import X from '../Exception';

import { ActionLimit, User, FreeAddress, Nonce } from '../../models';
import logger from '../../logger.mjs';
import { emailToUsername } from '../../utils/user.mjs';

export default class UsersUpdateEmail extends Base {
  static get validationRules() {
    return {
      data: {
        nested_object: {
          newEmail: ['required', 'string', 'email', 'to_lc'],
          nonce: [
            'required',
            {
              nested_object: {
                signatures: ['required', { list_of: 'string' }],
                challenge: ['required', 'string'],
              },
            },
          ],
        },
      },
    };
  }

  async execute({ data: { newEmail, nonce } }) {
    const user = await User.findByPk(this.context.id, {
      where: { status: User.STATUS.ACTIVE },
    });
    let newUsername = null;

    if (!(await Nonce.verify({ ...nonce, userId: this.context.id }))) {
      throw new X({
        code: 'AUTHENTICATION_FAILED',
        fields: {},
      });
    }

    const actionCompleted = await ActionLimit.executeWithinLimit(
      this.context.id,
      ActionLimit.ACTION.UPDATE_EMAIL,
      async () => {
        try {
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
        } catch (error) {
          logger.error(error);
          throw new X({
            code: 'SERVER_ERROR',
            fields: {
              update: 'UPDATE_FAILED',
            },
          });
        }
      },
    );

    if (!actionCompleted) {
      throw new X({
        code: 'LIMIT_EXCEEDED',
        fields: {
          email: 'TOO_MANY_UPDATE_EMAIL_REQUESTS',
        },
      });
    }

    return { data: { success: true, newUsername } };
  }

  static get paramsSecret() {
    return ['nonce'];
  }

  static get resultSecret() {
    return [];
  }
}
