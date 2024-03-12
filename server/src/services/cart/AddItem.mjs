import Sequelize from 'sequelize';

import Base from '../Base';
import X from '../Exception';

import {
  Cart,
  Domain,
  FioAccountProfile,
  FreeAddress,
  GatedRegistrtionTokens,
  ReferrerProfile,
} from '../../models';

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
      id: ['string'],
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
            hasCustomDomainInCart: ['boolean'],
            period: ['string'],
            type: ['required', 'string'],
          },
        },
      ],
      metamaskUserPublicKey: ['string'],
      prices: [
        {
          nested_object: {
            addBundles: ['string'],
            address: ['string'],
            domain: ['string'],
            renewDomain: ['string'],
          },
        },
      ],
      roe: ['string'],
      token: ['string'],
      userId: ['string'],
    };
  }

  async execute({
    id,
    item,
    metamaskUserPublicKey,
    prices,
    roe,
    token,
    userId: reqUserId,
  }) {
    try {
      const { domain, type } = item;

      const userId = this.context.id || reqUserId || null;

      const existingCart = await Cart.findById(id);

      const dashboardDomains = await Domain.getDashboardDomains();
      const allRefProfileDomains = await ReferrerProfile.getRefDomainsList();
      const freeDomainOwner = await FioAccountProfile.getDomainOwner(domain);
      const userHasFreeAddress = metamaskUserPublicKey
        ? await FreeAddress.getItems({ publicKey: metamaskUserPublicKey })
        : userId
        ? await FreeAddress.getItems({
            userId,
          })
        : null;

      const gatedRefProfile = await ReferrerProfile.findOne({
        where: Sequelize.literal(
          `"type" = '${ReferrerProfile.TYPE.REF}' AND "settings"->>'domains' ILIKE '%"name":"${domain}"%' AND "settings"->'gatedRegistration'->>'isOn' = 'true' AND "settings" IS NOT NULL`,
        ),
      });

      if ((gatedRefProfile || freeDomainOwner) && type === CART_ITEM_TYPE.ADDRESS) {
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
        renewDomain: renewDomainPrice,
      } = handledPrices;

      const isEmptyPrices =
        !addBundlesPrice || !addressPrice || !domainPrice || !renewDomainPrice;

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
        freeDomainOwner,
        item,
        userHasFreeAddress,
      });

      if (!existingCart) {
        const cart = await Cart.create({
          items: [handledFreeCartItem],
          userId,
          metamaskUserPublicKey,
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
        metamaskUserPublicKey,
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
