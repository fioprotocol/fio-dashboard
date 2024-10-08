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
  handlePrices,
} from '../../utils/cart.mjs';

import { CART_ITEM_TYPE } from '../../config/constants';

export default class AddItem extends Base {
  static get validationRules() {
    return {
      item: [
        'required',
        {
          nested_object: {
            address: ['string'],
            costFio: ['required', 'string'],
            costNativeFio: ['required', 'string'],
            costUsdc: ['required', 'string'],
            domain: ['required', 'string'],
            domainType: ['string'],
            id: ['required', 'string'],
            isFree: ['boolean'],
            isWatchedDomain: ['boolean'],
            hasCustomDomainInCart: ['boolean'],
            period: ['string'],
            type: ['required', 'string'],
          },
        },
      ],
      publicKey: ['string'],
      prices: [
        {
          nested_object: {
            addBundles: ['string'],
            address: ['string'],
            domain: ['string'],
            combo: ['string'],
            renewDomain: ['string'],
          },
        },
      ],
      roe: ['string'],
      token: ['string'],
      refCode: ['string'],
    };
  }

  async execute({ item, publicKey, prices, roe, token, refCode }) {
    try {
      const { domain, type } = item;

      const userId = this.context.id || null;
      const guestId = this.context.guestId || null;

      const where = {};
      if (userId) where.userId = userId;
      if (guestId) where.guestId = guestId;

      const existingCart = await Cart.findOne({ where });

      const dashboardDomains = await Domain.getDashboardDomains();
      const allRefProfileDomains = refCode
        ? await ReferrerProfile.getRefDomainsList({
            refCode,
          })
        : [];

      const freeDomainOwner = await FioAccountProfile.getDomainOwner(domain);

      const userHasFreeAddress =
        !publicKey && !userId ? [] : await FreeAddress.getItems({ publicKey, userId });

      const refProfile = await ReferrerProfile.findOne({
        where: { code: refCode },
      });

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

      const isRefCodeEqualGatedRefprofile =
        refCode &&
        gatedRefProfiles.length &&
        !!gatedRefProfiles.find(gatedRefProfile => gatedRefProfile.code === refCode);

      if (
        ((gatedRefProfiles.length &&
          (isRefCodeEqualGatedRefprofile ||
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

      const { handledPrices, handledRoe } = await handlePrices({ prices, roe });

      const {
        addBundles: addBundlesPrice,
        address: addressPrice,
        domain: domainPrice,
        combo: comboPrice,
        renewDomain: renewDomainPrice,
      } = handledPrices;

      const isEmptyPrices =
        !addBundlesPrice ||
        !addressPrice ||
        !domainPrice ||
        !comboPrice ||
        !renewDomainPrice;

      if (isEmptyPrices) {
        throw new X({
          code: 'ERROR',
          fields: {
            prices: 'PRICES_ARE_EMPTY',
          },
        });
      }

      if (!handledRoe) {
        throw new X({
          code: 'ERROR',
          fields: {
            roe: 'ROE_IS_EMPTY',
          },
        });
      }

      const handledFreeCartItem = handleFreeCartAddItem({
        allRefProfileDomains,
        cartItems: existingCart ? existingCart.items : [],
        dashboardDomains,
        item,
        freeDomainOwner,
        userHasFreeAddress,
        refCode: refProfile && refProfile.code,
      });

      if (!existingCart) {
        const cart = await Cart.create({
          items: [handledFreeCartItem],
          userId,
          guestId,
          publicKey,
        });

        return { data: Cart.format(cart.get({ plain: true })) };
      }

      const items = existingCart.items;

      const handledCartItemsWithExistingCustomDomain = handleFioHandleOnExistingCustomDomain(
        {
          cartItems: items,
          newItem: handledFreeCartItem,
          prices: handledPrices,
          roe: handledRoe,
        },
      );

      const handledCartItemsWithExistingFioHandleCustomDomain = handleFioHandleCartItemsWithCustomDomain(
        {
          cartItems: handledCartItemsWithExistingCustomDomain,
          item,
          prices: handledPrices,
          roe: handledRoe,
        },
      );

      await existingCart.update({
        items: handledCartItemsWithExistingFioHandleCustomDomain,
        userId,
        publicKey,
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
