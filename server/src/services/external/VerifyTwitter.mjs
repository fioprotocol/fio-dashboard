import { verifyTwitterHandle } from '../../external/twitter.mjs';

import logger from '../../logger';
import Base from '../Base';
import X from '../Exception.mjs';
import { Action, LockedFch } from '../../models/index.mjs';

import { EXPIRED_LOCKED_PERIOD } from '../../config/constants.js';

const LOCKED_FCH_COOKIE_NAME = 'locked-fch';

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
      const lockedFch = await LockedFch.findOne({ where: { fch } });

      if (lockedFch) {
        if (!LockedFch.isExpired(lockedFch)) {
          const isCurrentUsersLockedFch = userId === lockedFch.userId;
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

      await LockedFch.create({ fch, lockedFchToken, userId });

      this.res.cookie(LOCKED_FCH_COOKIE_NAME, lockedFchToken, {
        maxAge: EXPIRED_LOCKED_PERIOD,
      });

      return { data: { verified: true } };
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
