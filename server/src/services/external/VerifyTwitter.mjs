import { verifyTwitterHandle } from '../../external/twitter.mjs';

import logger from '../../logger';
import Base from '../Base';
import X from '../Exception.mjs';
import { Action, LockedFch } from '../../models/index.mjs';

import { EXPIRED_LOCKED_PERIOD } from '../../config/constants.js';

export default class VerifyTwitter extends Base {
  static get validationRules() {
    return {
      fch: ['string', 'required'],
      token: ['string'],
      twh: ['string', 'required'],
    };
  }

  async execute({ fch, token, twh }) {
    const userId = this.context.id;

    try {
      const lockedFch = await LockedFch.getItem({ fch });

      if (lockedFch) {
        if (!(await LockedFch.isExpired(lockedFch))) {
          const isCurrentUsersLockedFch = userId !== null && userId === lockedFch.userId;
          const hasTheSameToken = token === lockedFch.token;

          if (isCurrentUsersLockedFch || hasTheSameToken) {
            return {
              data: {
                verified: true,
              },
            };
          } else {
            return { data: { isLocked: true } };
          }
        }
      }

      const verifiedTwitterHandle = await verifyTwitterHandle(fch, twh);

      if (!verifiedTwitterHandle) return { data: { verified: false } };

      const lockedFchToken = await Action.generateHash();

      await LockedFch.create({ fch, token: lockedFchToken, userId });

      return {
        data: {
          verified: true,
          token: lockedFchToken,
          expires: (1 / (24 * 60)) * (EXPIRED_LOCKED_PERIOD / 1000 / 60), // expires shhould be in days
        },
      };
    } catch (e) {
      logger.error(`Twitter verification error: ${e}`);
      throw new X({
        code: 'SERVER_ERROR',
        fields: {
          twitter: 'SERVER_ERROR',
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
