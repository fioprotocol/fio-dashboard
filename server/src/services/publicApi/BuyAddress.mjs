import { FIOSDK } from '@fioprotocol/fiosdk';

import Base from '../Base';
import {
  Domain,
  FreeAddress,
  Order,
  OrderItem,
  Payment,
  ReferrerProfile,
} from '../../models';
import {
  createCallWithRetry,
  destructAddress,
  findDomainInRefProfile,
  formatChainAddress,
  formatChainDomain,
  generateErrorResponse,
  generateSuccessResponse,
  isPublicApiAvailable,
} from '../../utils/publicApi';
import { PUB_API_ERROR_CODES } from '../../constants/pubApiErrorCodes';
import { fioApi } from '../../external/fio';
import { getROE } from '../../external/roe';
import { FIO_ACTIONS } from '../../config/constants.js';
import { CURRENCY_CODES } from '../../constants/fio.mjs';
import { ORDER_USER_TYPES } from '../../constants/order.mjs';
import { HTTP_CODES } from '../../constants/general.mjs';
import {
  normalizePriceForBitPayInTestNet,
  prepareOrderWithFioPaymentForExecution,
} from '../../utils/payment.mjs';
import Bitpay from '../../external/payment-processor/bitpay.mjs';
import { getExistUsersByPublicKeyOrCreateNew } from '../../utils/user.mjs';
import { isDomainExpired } from '../../utils/fio.mjs';

export default class BuyAddress extends Base {
  async execute(args) {
    try {
      return await this.processing(args);
    } catch (e) {
      return generateErrorResponse(this.res, {
        error: `Server error. Please try later.`,
        errorCode: PUB_API_ERROR_CODES.SERVER_ERROR,
        statusCode: HTTP_CODES.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async processing({ apiToken, address, referralCode, publicKey }) {
    const isApiAvailable = await isPublicApiAvailable();

    if (!isApiAvailable) {
      return generateErrorResponse(this.res, {
        error: `Public api currently not available`,
        errorCode: PUB_API_ERROR_CODES.SERVER_UNAVAILABLE,
        statusCode: HTTP_CODES.SERVICE_UNAVAILABLE,
      });
    }

    const refNotFoundRes = {
      error: 'Referral code not found',
      errorCode: PUB_API_ERROR_CODES.REF_NOT_FOUND,
      statusCode: HTTP_CODES.NOT_FOUND,
    };

    if (!referralCode) {
      return generateErrorResponse(this.res, refNotFoundRes);
    }

    const refProfile = await ReferrerProfile.findOne({
      where: {
        type: ReferrerProfile.TYPE.REF,
        code: referralCode,
      },
    });

    if (!refProfile) {
      return generateErrorResponse(this.res, refNotFoundRes);
    }

    if (apiToken && refProfile.apiToken !== apiToken) {
      return generateErrorResponse(this.res, {
        error: `Invalid api token`,
        errorCode: PUB_API_ERROR_CODES.INVALID_API_TOKEN,
        statusCode: HTTP_CODES.BAD_REQUEST,
      });
    }

    const { type, fioAddress, fioDomain } = destructAddress(address);

    if (
      (fioAddress && !FIOSDK.isFioAddressValid(address)) ||
      !FIOSDK.isFioDomainValid(fioDomain)
    ) {
      return generateErrorResponse(this.res, {
        error: `Invalid ${type}`,
        errorCode: PUB_API_ERROR_CODES.INVALID_FIO_NAME,
        statusCode: HTTP_CODES.BAD_REQUEST,
      });
    }

    if (!FIOSDK.isFioPublicKeyValid(publicKey)) {
      return generateErrorResponse(this.res, {
        error: 'Missing public key',
        errorCode: PUB_API_ERROR_CODES.NO_PUBLIC_KEY_SPECIFIED,
        statusCode: HTTP_CODES.BAD_REQUEST,
      });
    }

    const domainFromChain = await fioApi.getFioDomain(fioDomain).then(formatChainDomain);

    if (
      domainFromChain &&
      isDomainExpired(domainFromChain.name, domainFromChain.expiration)
    ) {
      return generateErrorResponse(this.res, {
        error: 'Domain is expired. Please renew domain expiration',
        errorCode: PUB_API_ERROR_CODES.DOMAIN_IS_EXPIRED,
        statusCode: HTTP_CODES.BAD_REQUEST,
      });
    }

    if (domainFromChain && !domainFromChain.isPublic) {
      return generateErrorResponse(this.res, {
        error: 'Domain is not public',
        errorCode: PUB_API_ERROR_CODES.DOMAIN_IS_NOT_PUBLIC,
        statusCode: HTTP_CODES.BAD_REQUEST,
      });
    }

    if (type === 'account') {
      const addressFromChain = await fioApi
        .getFioAddress(address)
        .then(formatChainAddress);

      if (addressFromChain) {
        return generateErrorResponse(this.res, {
          error: 'Address already registered',
          errorCode: PUB_API_ERROR_CODES.ADDRESS_IS_ALREADY_REGISTERED,
          statusCode: HTTP_CODES.BAD_REQUEST,
        });
      }

      const isRegistrationAddressExist = await this.isSameAccountRegistrationExist(
        publicKey,
        refProfile,
        address,
      );

      if (isRegistrationAddressExist) {
        return generateErrorResponse(this.res, {
          error: `You have already sent a request to register a free FIO Crypto Handle for that domain`,
          errorCode: PUB_API_ERROR_CODES.ALREADY_SENT_REGISTRATION_REQ_FOR_ACCOUNT,
          statusCode: HTTP_CODES.BAD_REQUEST,
        });
      }

      const [user] = await getExistUsersByPublicKeyOrCreateNew(publicKey, referralCode);

      let isFreeRegistration = false;

      if (apiToken && domainFromChain) {
        const refDomain = findDomainInRefProfile(refProfile, fioDomain);

        if (refDomain) {
          isFreeRegistration =
            (!refDomain.isPremium || refDomain.isFirstRegFree) &&
            (await this.isFreeAddressNotExist(user.id, fioDomain));
        } else {
          const dashboardDomains = await Domain.getDashboardDomains();
          const dashboardDomain = dashboardDomains.find(it => it.name === fioDomain);

          isFreeRegistration =
            dashboardDomain &&
            !dashboardDomain.isPremium &&
            (await this.isFreeAddressNotExist(user.id, fioDomain));
        }
      }

      const { order, charge } = await this.createFreeAddressBuyOrder({
        publicKey,
        userId: user.id,
        refProfileId: refProfile.id,
        address: fioAddress,
        domain: fioDomain,
        isFree: isFreeRegistration,
        isDomainExist: !!domainFromChain,
      });

      return generateSuccessResponse(this.res, { accountId: order.id, charge });
    }

    if (domainFromChain) {
      return generateErrorResponse(this.res, {
        error: 'Domain already registered',
        errorCode: PUB_API_ERROR_CODES.DOMAIN_IS_ALREADY_REGISTERED,
        statusCode: HTTP_CODES.BAD_REQUEST,
      });
    }

    const [user] = await getExistUsersByPublicKeyOrCreateNew(publicKey, referralCode);

    const { order, charge } = await this.createFreeAddressBuyOrder({
      publicKey,
      userId: user.id,
      refProfileId: refProfile.id,
      address: fioAddress,
      domain: fioDomain,
    });

    return generateSuccessResponse(this.res, { accountId: order.id, charge });
  }

  async createFreeAddressBuyOrder({
    publicKey,
    userId,
    refProfileId,
    address,
    domain,
    isFree,
    isDomainExist,
  }) {
    const roe = await getROE();
    const prices = await fioApi.getPrices(true);
    const nativeFio = address
      ? isDomainExist
        ? prices.address
        : prices.combo
      : prices.domain;
    const priceUsdc = fioApi.convertFioToUsdc(nativeFio, roe);
    const normalizedPriceUsdc = isFree
      ? priceUsdc
      : normalizePriceForBitPayInTestNet(priceUsdc);

    let orderItem, order;

    await Order.sequelize.transaction(async t => {
      order = await Order.create(
        {
          status: Order.STATUS.NEW,
          total: isFree ? 0 : normalizedPriceUsdc,
          roe,
          publicKey,
          userId,
          refProfileId,
          data: { orderUserType: ORDER_USER_TYPES.PARTNER_API_CLIENT },
        },
        { transaction: t },
      );

      order.number = Order.generateNumber(order.id);

      await order.save({ transaction: t });

      const action = address
        ? isDomainExist
          ? FIO_ACTIONS.registerFioAddress
          : FIO_ACTIONS.registerFioDomainAddress
        : FIO_ACTIONS.registerFioDomain;

      orderItem = await OrderItem.create(
        {
          orderId: order.id,
          address,
          domain,
          action,
          nativeFio: isFree ? '0' : nativeFio.toString(),
          price: isFree ? 0 : normalizedPriceUsdc,
          priceCurrency: CURRENCY_CODES.USDC,
          data: { orderUserType: ORDER_USER_TYPES.PARTNER_API_CLIENT },
        },
        { transaction: t },
      );
    });

    const payment = await Payment.createForOrder(
      order,
      isFree ? Payment.PROCESSOR.FIO : Payment.PROCESSOR.BITPAY,
      [orderItem],
    );

    let charge;

    if (!isFree) {
      charge = await createCallWithRetry(
        6,
        1000,
      )(() => Bitpay.getInvoice(payment.externalPaymentId));
    }

    if (isFree) {
      await prepareOrderWithFioPaymentForExecution({
        paymentId: payment.id,
        orderItems: [orderItem],
        fioNativePrice: nativeFio,
      });
    }

    return { order, orderItem, payment, charge };
  }

  async isFreeAddressNotExist(userId, fioDomain) {
    const freeAddresses = await FreeAddress.findAll({
      where: { userId },
    });

    const freeRegisteredAddressWithDomain = freeAddresses.find(it => {
      const { fioDomain: addressFioDomain } = destructAddress(it.name);
      return addressFioDomain === fioDomain;
    });

    return !freeRegisteredAddressWithDomain;
  }

  async isSameAccountRegistrationExist(publicKey, refProfile, address) {
    const { fioAddress, fioDomain } = destructAddress(address);

    const orders = await Order.findAll({
      where: {
        publicKey,
        refProfileId: refProfile.id,
      },
      include: [OrderItem],
    });

    const order = orders
      .flatMap(it => it.OrderItems)
      .find(({ address, domain }) => address === fioAddress && domain === fioDomain);

    return !!order;
  }

  static get validationRules() {
    return {
      apiToken: ['string'],
      address: ['required', 'string'],
      referralCode: ['string'],
      publicKey: ['required', 'string'],
    };
  }

  static get paramsSecret() {
    return ['apiToken'];
  }

  static get resultSecret() {
    return ['success'];
  }
}
