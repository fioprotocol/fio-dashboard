import { FIOSDK } from '@fioprotocol/fiosdk';

import Base from '../Base';
import { FreeAddress, Order, OrderItem, ReferrerProfile } from '../../models';
import { formatChainDomain, generateResponse } from '../../utils/publicApi';
import { PUB_API_ERROR_CODES } from '../../constants/pubApiErrorCodes';
import { fioApi } from '../../external/fio';
import { getROE } from '../../external/roe';
import { FIO_ACTIONS } from '../../config/constants.js';
import { CURRENCY_CODES } from '../../constants/fio.mjs';
import { ORDER_USER_TYPES } from '../../constants/order.mjs';

export default class BuyAddress extends Base {
  async execute(args) {
    try {
      return await this.processing(args);
    } catch (e) {
      return generateResponse({
        error: `Server error. Please try later.`,
        errorCode: PUB_API_ERROR_CODES.SERVER_ERROR,
      });
    }
  }

  async processing({ apiToken, address, referralCode, publicKey }) {
    const refNotFoundRes = {
      error: 'Referral code not found',
      errorCode: PUB_API_ERROR_CODES.REF_NOT_FOUND,
    };

    if (!referralCode) {
      return generateResponse(refNotFoundRes);
    }

    const refProfile = await ReferrerProfile.findOne({
      where: {
        type: ReferrerProfile.TYPE.REF,
        code: referralCode,
      },
    });

    if (!refProfile) {
      return generateResponse(refNotFoundRes);
    }

    let fioAddress = null;
    let fioDomain = null;

    if (address.includes('@')) {
      const [handle, domain] = address.split('@');
      fioAddress = handle;
      fioDomain = domain;
    } else {
      fioDomain = address;
    }

    const type = fioAddress ? 'account' : 'domain';

    if (
      (fioAddress && !FIOSDK.isFioAddressValid(address)) ||
      !FIOSDK.isFioDomainValid(fioDomain)
    ) {
      return generateResponse({
        error: `Invalid ${type}`,
        errorCode: PUB_API_ERROR_CODES.INVALID_FIO_NAME,
      });
    }

    if (!FIOSDK.isFioPublicKeyValid(publicKey)) {
      return generateResponse({
        error: 'Missing public key',
        errorCode: PUB_API_ERROR_CODES.NO_PUBLIC_KEY_SPECIFIED,
      });
    }

    if (!apiToken) {
      return generateResponse({
        error: 'Sale Closed. Please try back soon…',
        errorCode: PUB_API_ERROR_CODES.SALE_IS_CLOSED,
      });
    }

    if (refProfile.apiToken !== apiToken) {
      return generateResponse({
        error:
          'Unauthorized: Due to the referral code sale price, a user API Token is required',
        errorCode: PUB_API_ERROR_CODES.SALE_IS_CLOSED,
      });
    }

    const refDomains =
      refProfile.settings &&
      refProfile.settings.domains &&
      Array.isArray(refProfile.settings.domains)
        ? refProfile.settings.domains
        : [];
    const refDomain = refDomains.find(({ name }) => name === fioDomain);

    if (type === 'account') {
      if (!refDomain) {
        const domainFromChain = await fioApi.getFioDomain(fioDomain);
        const domain = formatChainDomain(domainFromChain);

        if (!domain) {
          return generateResponse({
            error: 'Domain is not registered',
            errorCode: PUB_API_ERROR_CODES.DOMAIN_IS_NOT_REGISTERED,
          });
        }
        if (!domain.isPublic) {
          return generateResponse({
            error: 'Domain is not public',
            errorCode: PUB_API_ERROR_CODES.DOMAIN_IS_NOT_PUBLIC,
          });
        }
      }

      // TODO check address or fioAddress
      const addressFromChain = await fioApi.getFioAddress(address);
      if (addressFromChain) {
        return generateResponse({
          error: 'Already registered',
          errorCode: PUB_API_ERROR_CODES.ADDRESS_IS_ALREADY_REGISTERED,
        });
      }

      const freeAddresses = await FreeAddress.findAll({
        where: { publicKey },
      });

      let freeRegisteredBeforeDomain;

      if (refDomain) {
        freeRegisteredBeforeDomain = freeAddresses.find(it => {
          const [, domain] = it.split('@');
          return domain === refDomain.name;
        });
      }

      if (freeRegisteredBeforeDomain) {
        return generateResponse({
          error: `You have already registered a free FIO Crypto Handle for that domain`,
          errorCode: PUB_API_ERROR_CODES.ONE_FREE_ADDRESS_PER_DOMAIN_ERROR,
        });
      }

      const isFreeRegistration =
        !freeRegisteredBeforeDomain &&
        refDomain &&
        (!refDomain.isPremium || refDomain.isFirstRegFree);

      if (isFreeRegistration) {
        const orders = await Order.findAll({
          where: {
            publicKey,
            refProfileId: refProfile.id,
          },
          include: [OrderItem],
        });

        const registeringAccount = orders
          .flatMap(it => it.OrderItems)
          .find(({ address, domain }) => address === fioAddress && domain === fioDomain);

        if (registeringAccount) {
          return generateResponse({
            error: `You have already sent a request to register a free FIO Crypto Handle for that domain`,
            errorCode: PUB_API_ERROR_CODES.ALREADY_SENT_REGISTRATION_REQ_FOR_DOMAIN,
          });
        }

        const orderId = await this.createFreeAddressBuyOrder({
          publicKey,
          refProfileId: refProfile.id,
          address: fioAddress,
          domain: fioDomain,
        });

        return generateResponse({ accountId: orderId });
      } else {
        // Add bitpay for paid transactions
      }
    }
  }

  async createFreeAddressBuyOrder({ publicKey, refProfileId, address, domain }) {
    const roe = await getROE();
    const prices = await fioApi.getPrices(true);
    const price = fioApi.convertFioToUsdc(prices.address, roe);

    let orderNumber;

    await Order.sequelize.transaction(async t => {
      const order = await Order.create(
        {
          status: Order.STATUS.NEW,
          total: price,
          roe,
          publicKey,
          refProfileId,
          data: { orderUserType: ORDER_USER_TYPES.PARTNER_API_CLIENT },
        },
        { transaction: t },
      );

      orderNumber = order.number = Order.generateNumber(order.id);

      await order.save({ transaction: t });

      await OrderItem.create(
        {
          orderId: order.id,
          address,
          domain,
          action: FIO_ACTIONS.registerFioAddress,
          nativeFio: prices.address.toString(),
          price,
          priceCurrency: CURRENCY_CODES.USDC,
          data: { orderUserType: ORDER_USER_TYPES.PARTNER_API_CLIENT },
        },
        { transaction: t },
      );

      await Order.update(
        {
          status: Order.STATUS.PENDING,
        },
        {
          where: { id: order.id },
          transaction: t,
        },
      );
    });

    return orderNumber;
  }

  static get validationRules() {
    return {
      apiToken: ['string'],
      address: ['required', 'string'],
      referralCode: 'string',
      publicKey: ['required', 'string'],
    };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return [];
  }
}
