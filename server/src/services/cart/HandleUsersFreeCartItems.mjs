import Base from '../Base';
import X from '../Exception';

import { Cart } from '../../models';

import logger from '../../logger.mjs';

import { handleFreeItems } from '../../utils/cart.mjs';
import { getExistUsersByPublicKeyOrCreateNew } from '../../utils/user.mjs';

export default class HandleUsersFreeCartItems extends Base {
  static get validationRules() {
    return {
      publicKey: ['string', 'fio_public_key'],
      refCode: ['string'],
    };
  }

  async execute({ publicKey, refCode }) {
    try {
      const userId = this.context.id || null;
      const guestId = this.context.guestId || null;

      return await Cart.sequelize.transaction(async t => {
        const cart = await Cart.getActive(
          { userId, guestId },
          { transaction: t, lock: t.LOCK.UPDATE },
        );

        if (!cart) {
          return {
            data: { items: [] },
          };
        }

        let noProfileResolvedUser = null;
        if (!userId && publicKey) {
          const [resolvedUser] = await getExistUsersByPublicKeyOrCreateNew(
            publicKey,
            refCode,
            undefined,
            { transaction: t },
          );
          noProfileResolvedUser = resolvedUser;
        }

        const {
          userRefProfile,
          domainsList,
          freeDomainToOwner,
          userHasFreeAddress,
          noAuth,
        } = await Cart.getDataForCartItemsUpdate({
          refCode,
          noProfileResolvedUser,
          publicKey,
          userId,
          items: cart.items,
        });

        const handledFreeCartItems = handleFreeItems({
          cartItems: cart.items,
          domainsList,
          freeDomainToOwner,
          userHasFreeAddress,
          userRefCode: userRefProfile && userRefProfile.code,
          noAuth,
        });

        await cart.update(
          {
            items: handledFreeCartItems,
            userId,
            publicKey: noProfileResolvedUser ? publicKey : null,
          },
          { transaction: t },
        );

        return {
          data: Cart.format(cart.get({ plain: true })),
        };
      });
    } catch (error) {
      logger.error(error);
      throw new X({
        code: 'CART_UPDATE',
        fields: {
          freeCartItems: 'CANNOT_HANDLE_FREE_CART_ITEMS',
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
