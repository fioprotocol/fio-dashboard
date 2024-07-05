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

import config from '../../config/index.mjs';

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
            isWatchedDomain: ['boolean'],
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
            combo: ['string'],
            renewDomain: ['string'],
          },
        },
      ],
      roe: ['string'],
      token: ['string'],
      userId: ['string'],
      cookies: ['any_object'],
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
    cookies,
  }) {
    try {
      const { domain, type } = item;

      const userId = this.context.id || reqUserId || null;
      const refCookie = cookies && cookies[config.refCookieName];

      const existingCart = await Cart.findById(id);

      const dashboardDomains = await Domain.getDashboardDomains();
      const allRefProfileDomains = await ReferrerProfile.getRefDomainsList({
        refCode: refCookie,
      });
      const freeDomainOwner = await FioAccountProfile.getDomainOwner(domain);
      const userHasFreeAddress = metamaskUserPublicKey
        ? await FreeAddress.getItems({ publicKey: metamaskUserPublicKey })
        : userId
        ? await FreeAddress.getItems({
            userId,
          })
        : null;

      const refProfile = await ReferrerProfile.findOne({
        where: { code: refCookie },
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

      const isRefCookieEqualGatedRefprofile =
        refCookie &&
        gatedRefProfiles.length &&
        !!gatedRefProfiles.find(gatedRefProfile => gatedRefProfile.code === refCookie);

      if (
        ((gatedRefProfiles.length &&
          (isRefCookieEqualGatedRefprofile ||
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
        freeDomainOwner,
        item,
        userHasFreeAddress,
        refCode: refProfile && refProfile.code,
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
