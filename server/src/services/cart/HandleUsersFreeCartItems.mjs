import Sequelize from 'sequelize';

import Base from '../Base';
import X from '../Exception';

import {
  Cart,
  Domain,
  FreeAddress,
  ReferrerProfile,
  FioAccountProfile,
} from '../../models';

import logger from '../../logger.mjs';

import { handleUsersFreeCartItems } from '../../utils/cart.mjs';
import { CART_ITEM_TYPE } from '../../config/constants.js';

export default class HandleUsersFreeCartItems extends Base {
  static get validationRules() {
    return {
      publicKey: ['string'],
      refCode: ['string'],
    };
  }

  async execute({ publicKey, refCode }) {
    try {
      const userId = this.context.id || null;
      const guestId = this.context.guestId || null;

      const cart = await Cart.getActive({ userId, guestId });

      if (!cart) {
        return {
          data: { items: [] },
        };
      }

      const isNoProfileFlow = !userId && publicKey;
      const dashboardDomains = await Domain.getDashboardDomains();
      const allRefProfileDomains = refCode
        ? await ReferrerProfile.getRefDomainsList({
            refCode,
          })
        : [];

      // Check if fch items has domain in fio account profile
      const domains = cart.items.reduce((acc, item) => {
        if (item.type === CART_ITEM_TYPE.ADDRESS) {
          acc.push(item.domain);
        }
        return acc;
      }, []);
      const freeDomainOwners = await FioAccountProfile.findAll({
        where: {
          domains: {
            [Sequelize.Op.contains]: [...domains],
          },
        },
      });
      const freeDomainToOwner = domains.reduce((acc, item) => {
        const domainOwner = freeDomainOwners.find(
          owner => owner.domains && owner.domains.includes(item),
        );
        if (domainOwner) {
          acc[item] = domainOwner;
        }
        return acc;
      }, {});

      const userHasFreeAddress =
        !publicKey && !userId
          ? []
          : await FreeAddress.getItems({
              publicKey,
              userId,
            });

      const handledFreeCartItems = handleUsersFreeCartItems({
        allRefProfileDomains,
        cartItems: cart.items,
        dashboardDomains,
        freeDomainToOwner,
        userHasFreeAddress,
        refCode,
      });

      await cart.update({
        items: handledFreeCartItems,
        userId,
        publicKey: isNoProfileFlow ? publicKey : null,
      });

      return {
        data: Cart.format(cart.get({ plain: true })),
      };
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
