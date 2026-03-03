import Base from '../Base.mjs';
import X from '../Exception.mjs';

import { Cart } from '../../models/Cart.mjs';
import { Order } from '../../models/Order.mjs';
import { ReferrerProfile } from '../../models/ReferrerProfile.mjs';
import { GatedRegistrtionTokens } from '../../models/GatedRegistrationTokens.mjs';

import logger from '../../logger.mjs';

import {
  handleFioHandleOnExistingCustomDomain,
  handleFreeCartAddItem,
  handleFioHandleCartItemsWithCustomDomain,
  getItemCost,
} from '../../utils/cart.mjs';
import {
  isCartItemDuplicateRegistration,
  getCartWarnings,
} from '../../utils/order-validation.mjs';
import { fioApi } from '../../external/fio.mjs';

import {
  CART_ITEM_TYPE,
  DOMAIN_RENEW_PERIODS,
  ERROR_CODES,
} from '../../config/constants';

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

  checkForDuplicateItem(newItem, existingItems) {
    const { id, type, address, domain } = newItem;

    // Check for duplicates in register actions
    const duplicateItem = existingItems.find(
      item =>
        item.id === id ||
        (item.address === address &&
          item.domain === domain &&
          type !== CART_ITEM_TYPE.DOMAIN_RENEWAL &&
          type !== CART_ITEM_TYPE.ADD_BUNDLES),
    );

    return !!duplicateItem;
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

      // Check for duplicates in the cart itself
      if (existingCart && existingCart.items) {
        const isDuplicate = this.checkForDuplicateItem(newItem, existingCart.items);
        if (isDuplicate) {
          throw new Error(`Duplicate cart item: ${newItem.id} - ${newItem.type}`);
        }
      }

      // Check for duplicates against active (in-progress) orders
      const activeOrderItems = userId
        ? await Order.getActiveOrderItemsByUser({ userId })
        : [];

      if (activeOrderItems.length) {
        if (isCartItemDuplicateRegistration({ item: newItem, activeOrderItems })) {
          throw new X({
            code: ERROR_CODES.DUPLICATE_ORDER,
            fields: {
              addItem: 'ITEM_IS_ALREADY_IN_PROCESSING_ORDER',
            },
          });
        }
      }

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
        const cartData = Cart.format(cart.get({ plain: true }));
        const warnings = userId
          ? await getCartWarnings({ cartItems: cartData.items, activeOrderItems })
          : null;

        return { data: { ...cartData, warnings } };
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

      const cartData = Cart.format(existingCart.get({ plain: true }));
      const warnings = userId
        ? await getCartWarnings({ cartItems: cartData.items, activeOrderItems })
        : null;

      return {
        data: { ...cartData, warnings },
      };
    } catch (error) {
      if (error instanceof X) {
        throw error;
      }
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
