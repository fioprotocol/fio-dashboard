import Base from '../Base.mjs';
import X from '../Exception.mjs';

import { Cart } from '../../models/Cart.mjs';
import { ReferrerProfile } from '../../models/ReferrerProfile.mjs';
import { GatedRegistrtionTokens } from '../../models/GatedRegistrationTokens.mjs';

import logger from '../../logger.mjs';

import {
  handleFioHandleOnExistingCustomDomain,
  handleFreeCartAddItem,
  handleFioHandleCartItemsWithCustomDomain,
  getItemCost,
} from '../../utils/cart.mjs';
import { fioApi } from '../../external/fio.mjs';

import { CART_ITEM_TYPE, DOMAIN_RENEW_PERIODS } from '../../config/constants';
import { checkPrices } from '../../utils/prices.mjs';
import { getExistUsersByPublicKeyOrCreateNew } from '../../utils/user.mjs';
import { normalizeFioHandle } from '../../utils/fio.mjs';
import { Domain } from '../../models/Domain.mjs';

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
      id: normalizeFioHandle(id),
      address: normalizeFioHandle(address),
      domain: normalizeFioHandle(domain),
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
      const { address, domain, type } = newItem;

      const userId = this.context.id || null;
      const guestId = this.context.guestId || null;

      if (!userId && !guestId) {
        logger.error(`Error not authorized: userId - ${userId}, guestId - ${guestId}`);

        throw new X({
          code: 'NOT_FOUND',
          fields: {},
        });
      }

      if (
        (type === CART_ITEM_TYPE.ADDRESS ||
          type === CART_ITEM_TYPE.ADDRESS_WITH_CUSTOM_DOMAIN) &&
        !(await fioApi.validateFioAddress(address, domain))
      ) {
        throw new X({
          code: 'SERVER_ERROR',
          fields: {
            address: 'INVALID_FIO_HANDLE',
          },
        });
      }

      let noProfileResolvedUser = null;
      if (!userId && publicKey) {
        const [resolvedUser] = await getExistUsersByPublicKeyOrCreateNew(
          publicKey,
          refCode,
        );
        noProfileResolvedUser = resolvedUser;
      }

      const existingCart = await Cart.getActive({ userId, guestId });

      const { prices, roe, updatedAt } = existingCart
        ? existingCart.options
        : await Cart.getCartOptions({ options: {} });

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
        domain,
      });

      // do not allow refCode other than auth user has
      if (userId) refCode = userRefProfile ? userRefProfile.code : null;

      const dashboardDomains = refCode ? await Domain.getDashboardDomains() : domainsList;

      const gatedRefProfiles = await ReferrerProfile.sequelize.query(
        `SELECT code FROM "referrer-profiles"
         WHERE "type" = :refType
         AND "settings"->>'domains' ILIKE :domainPattern
         AND "settings"->'gatedRegistration'->>'isOn' = 'true'
         AND "settings" IS NOT NULL
         AND "deletedAt" IS NULL`,
        {
          replacements: {
            refType: ReferrerProfile.TYPE.REF,
            domainPattern: `%"name":${JSON.stringify(domain)}%`,
          },
          type: ReferrerProfile.sequelize.QueryTypes.SELECT,
        },
      );

      const domainExists = dashboardDomains.find(
        dashboardDomain => dashboardDomain.name === domain,
      );

      const isRefCodeEqualGatedRefProfile =
        refCode &&
        gatedRefProfiles.length &&
        !!gatedRefProfiles.find(gatedRefProfile => gatedRefProfile.code === refCode);

      if (
        ((gatedRefProfiles.length && (isRefCodeEqualGatedRefProfile || !domainExists)) ||
          freeDomainToOwner[domain]) &&
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
        cartItems: existingCart ? existingCart.items : [],
        domainsList,
        item: newItem,
        freeDomainToOwner,
        userHasFreeAddress,
        userRefCode: userRefProfile && userRefProfile.code,
        noAuth,
      });

      if (!existingCart) {
        const cartFields = {
          items: [handledFreeCartItem],
          publicKey: noProfileResolvedUser ? publicKey : null,
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
        publicKey: noProfileResolvedUser ? publicKey : null,
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
