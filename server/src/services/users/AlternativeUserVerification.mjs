import logger from '../../logger';
import Base from '../Base';
import X from '../Exception.mjs';

import { Action, GatedRegistrtionTokens, User } from '../../models';

export default class AlternativeUserVerification extends Base {
  async execute() {
    try {
      const userId = this.context.id;

      const userWithAlternativeProfile = await User.findById(userId, {
        where: {
          userProfileType: User.USER_PROFILE_TYPE.ALTERNATIVE,
        },
      });

      if (!userWithAlternativeProfile) {
        throw new Error('User type is not ALTERNATIVE');
      }

      const gatedToken = await Action.generateHash();

      if (!gatedToken) {
        throw new X({
          code: 'SERVER_ERROR',
          fields: {
            token: 'CANNOT_CREATE_TOKEN',
          },
        });
      }

      await GatedRegistrtionTokens.create({ token: gatedToken });

      return {
        data: gatedToken,
      };
    } catch (e) {
      logger.error(`[Alternative profile verification] error: ${e}`);
      throw new X({
        code: 'ALTERNATIVE_PROFILE_VERIFICATION_FAILED',
        fields: {
          token: 'ALTERNATIVE_PROFILE_VERIFICATION_FAILED',
        },
      });
    }
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return ['*'];
  }
}
