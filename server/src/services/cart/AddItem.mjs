import Sequelize from 'sequelize';

import Base from '../Base.mjs';
import X from '../Exception.mjs';

import { Cart } from '../../models/Cart.mjs';
import { Domain } from '../../models/Domain.mjs';
import { FreeAddress } from '../../models/FreeAddress.mjs';
import { ReferrerProfile } from '../../models/ReferrerProfile.mjs';
import { FioAccountProfile } from '../../models/FioAccountProfile.mjs';
import { GatedRegistrtionTokens } from '../../models/GatedRegistrationTokens.mjs';

import logger from '../../logger.mjs';

import {
  handleFioHandleOnExistingCustomDomain,
  handleFreeCartAddItem,
  handleFioHandleCartItemsWithCustomDomain,
  getItemCost,
} from '../../utils/cart.mjs';

import { CART_ITEM_TYPE, DOMAIN_RENEW_PERIODS } from '../../config/constants';
import { checkPrices } from '../../utils/prices.mjs';

export default class AddItem extends Base {
  static get validationRules() {
    return {
      item: [
        'required',
        {
          nested_object: {
            address: ['string'],
            domain: ['required', 'string'],
            domainType: ['string'],
            id: ['required', 'string'],
            isFree: ['boolean'],
            isWatchedDomain: ['boolean'],
            hasCustomDomainInCart: ['boolean'],
            period: ['integer', { one_of: DOMAIN_RENEW_PERIODS }],
            type: ['required', 'string'],
          },
        },
      ],
      publicKey: ['string'], // no profile flow
      token: ['string'],
      refCode: ['string'],
    };
  }

  setNewItemProps(item) {
    const {
      id,
      address,
      domain,
      domainType,
      isFree,
      isWatchedDomain,
      hasCustomDomainInCart,
      period,
      type,
    } = item;

    return {
      id,
      address,
      domain,
      domainType,
      isFree,
      isWatchedDomain,
      hasCustomDomainInCart,
      period,
      type,
    };
  }

  async execute({ item, publicKey, token, refCode }) {
    try {
      let newItem = this.setNewItemProps(item);
      const { domain, type } = newItem;

      const userId = this.context.id || null;
      const guestId = this.context.guestId || null;

      if (!userId && !guestId) {
        logger.error(`Error not authorized: userId - ${userId}, guestId - ${guestId}`);

        throw new X({
          code: 'NOT_FOUND',
          fields: {},
        });
      }

      const isNoProfileFlow = !userId && publicKey;
      const existingCart = await Cart.getActive({ userId, guestId });

      const { prices, roe, updatedAt } = existingCart
        ? existingCart.options
        : await Cart.getCartOptions({ options: {} });

      const dashboardDomains = await Domain.getDashboardDomains();
      const allRefProfileDomains = refCode
        ? await ReferrerProfile.getRefDomainsList({
            refCode,
          })
        : [];

      const freeDomainOwner = await FioAccountProfile.getDomainOwner(domain);

      const userHasFreeAddress =
        !publicKey && !userId ? [] : await FreeAddress.getItems({ publicKey, userId });

      const refProfile = refCode
        ? await ReferrerProfile.findOne({
            where: { code: refCode },
          })
        : null;

      const gatedRefProfiles = await ReferrerProfile.findAll({
        where: Sequelize.literal(
          `"type" = '${ReferrerProfile.TYPE.REF}' AND "settings"->>'domains' ILIKE '%"name":"${domain}"%' AND "settings"->'gatedRegistration'->>'isOn' = 'true' AND "settings" IS NOT NULL`,
        ),
      });

      const domainExistsInDashboardDomains = dashboardDomains.find(
        dashboardDomain => dashboardDomain.name === domain,
      );

      const domainExistsInRefProfile =
        refProfile &&
        refProfile.settings &&
        refProfile.settings.domains &&
        !!refProfile.settings.domains.find(refDomain => refDomain.name === domain);

      const isRefCodeEqualGatedRefProfile =
        refCode &&
        gatedRefProfiles.length &&
        !!gatedRefProfiles.find(gatedRefProfile => gatedRefProfile.code === refCode);

      if (
        ((gatedRefProfiles.length &&
          (isRefCodeEqualGatedRefProfile ||
            (!domainExistsInDashboardDomains && !domainExistsInRefProfile))) ||
          freeDomainOwner) &&
        type === CART_ITEM_TYPE.ADDRESS
      ) {
        const gatedRegistrationToken = await GatedRegistrtionTokens.findOne({
          where: { token },
        });

        if (!gatedRegistrationToken) {
          throw new X({
            code: 'SERVER_ERROR',
            fields: {
              token: 'NOT_FOUND',
            },
          });
        }

        await gatedRegistrationToken.destroy({ force: true });
      }

      checkPrices(prices, roe);

      const costs = getItemCost({ item: newItem, prices, roe });
      newItem = { ...newItem, ...costs };

      const handledFreeCartItem = handleFreeCartAddItem({
        allRefProfileDomains,
        cartItems: existingCart ? existingCart.items : [],
        dashboardDomains,
        item: newItem,
        freeDomainOwner,
        userHasFreeAddress,
        refCode: refProfile && refProfile.code,
        prices,
        roe,
      });

      if (!existingCart) {
        const cartFields = {
          items: [handledFreeCartItem],
          publicKey: isNoProfileFlow ? publicKey : null,
          options: {
            prices,
            roe,
            updatedAt,
          },
        };

        if (userId) cartFields.userId = userId;
        if (guestId) cartFields.guestId = guestId;

        const cart = await Cart.create(cartFields);

        return { data: Cart.format(cart.get({ plain: true })) };
      }

      const items = existingCart.items;

      const handledCartItemsWithExistingCustomDomain = handleFioHandleOnExistingCustomDomain(
        {
          cartItems: items,
          newItem: handledFreeCartItem,
          prices,
          roe,
        },
      );

      const handledCartItemsWithExistingFioHandleCustomDomain = handleFioHandleCartItemsWithCustomDomain(
        {
          cartItems: handledCartItemsWithExistingCustomDomain,
          item: newItem,
          prices,
          roe,
        },
      );

      await existingCart.update({
        items: handledCartItemsWithExistingFioHandleCustomDomain,
        userId,
        publicKey: isNoProfileFlow ? publicKey : null,
      });

      return {
        data: Cart.format(existingCart.get({ plain: true })),
      };
    } catch (error) {
      logger.error(error);
      throw new X({
        code: 'SERVER_ERROR',
        fields: {
          addItem: 'CANNOT_ADD_CART_ITEM',
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
