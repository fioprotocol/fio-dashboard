import { FIOSDK } from '@fioprotocol/fiosdk';

import Base from '../Base';
import { FreeAddress, Order, OrderItem, Payment, ReferrerProfile } from '../../models';
import {
  destructAddress,
  formatChainDomain,
  generateErrorResponse,
  generateSuccessResponse,
} from '../../utils/publicApi';
import { PUB_API_ERROR_CODES } from '../../constants/pubApiErrorCodes';
import { fioApi } from '../../external/fio';
import { getROE } from '../../external/roe';
import { FIO_ACTIONS } from '../../config/constants.js';
import { CURRENCY_CODES } from '../../constants/fio.mjs';
import { ORDER_USER_TYPES } from '../../constants/order.mjs';
import { HTTP_CODES } from '../../constants/general.mjs';
import { hashFromApiToken } from '../../utils/crypto.mjs';
import {
  normalizePriceForBitPayInTestNet,
  prepareOrderWithFioPaymentForExecution,
} from '../../utils/payment.mjs';
import Bitpay from '../../external/payment-processor/bitpay.mjs';

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

    if (apiToken && refProfile.apiToken !== hashFromApiToken(apiToken)) {
      return generateErrorResponse(this.res, {
        error: `Invalid api token `,
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

    const orders = await Order.findAll({
      where: {
        publicKey,
        refProfileId: refProfile.id,
      },
      include: [OrderItem],
    });

    const domainFromChain = await fioApi.getFioDomain(fioDomain);
    const domain = formatChainDomain(domainFromChain);

    if (type === 'account') {
      if (domain && !domain.isPublic) {
        return generateErrorResponse(this.res, {
          error: 'Domain is not public',
          errorCode: PUB_API_ERROR_CODES.DOMAIN_IS_NOT_PUBLIC,
          statusCode: HTTP_CODES.NOT_FOUND,
        });
      }

      const addressFromChain = await fioApi.getFioAddress(address);

      if (addressFromChain) {
        return generateErrorResponse(this.res, {
          error: 'Address already registered',
          errorCode: PUB_API_ERROR_CODES.ADDRESS_IS_ALREADY_REGISTERED,
          statusCode: HTTP_CODES.BAD_REQUEST,
        });
      }

      const freeAddresses = await FreeAddress.findAll({
        where: { publicKey },
      });

      let freeRegisteredAddressWithDomain;

      const refDomains =
        refProfile.settings &&
        refProfile.settings.domains &&
        Array.isArray(refProfile.settings.domains)
          ? refProfile.settings.domains
          : [];
      const refDomain = refDomains.find(({ name }) => name === fioDomain);

      if (refDomain) {
        freeRegisteredAddressWithDomain = freeAddresses.find(it => {
          const { fioDomain } = destructAddress(it);
          return fioDomain === refDomain.name;
        });
      }

      if (freeRegisteredAddressWithDomain) {
        return generateErrorResponse(this.res, {
          error: `You have already registered a free FIO Crypto Handle for that domain`,
          errorCode: PUB_API_ERROR_CODES.ONE_FREE_ADDRESS_PER_DOMAIN_ERROR,
          statusCode: HTTP_CODES.BAD_REQUEST,
        });
      }

      const registeringAccount = orders
        .flatMap(it => it.OrderItems)
        .find(({ address, domain }) => address === fioAddress && domain === fioDomain);

      if (registeringAccount) {
        return generateErrorResponse(this.res, {
          error: `You have already sent a request to register a free FIO Crypto Handle for that domain`,
          errorCode: PUB_API_ERROR_CODES.ALREADY_SENT_REGISTRATION_REQ_FOR_ACCOUNT,
          statusCode: HTTP_CODES.BAD_REQUEST,
        });
      }

      const isFreeRegistration =
        !freeRegisteredAddressWithDomain &&
        apiToken &&
        domain &&
        refDomain &&
        (!refDomain.isPremium || refDomain.isFirstRegFree);

      const { order, charge } = await this.createFreeAddressBuyOrder({
        publicKey,
        refProfileId: refProfile.id,
        address: fioAddress,
        domain: fioDomain,
        isFree: isFreeRegistration,
        isDomainExist: !!domain,
      });

      return generateSuccessResponse(this.res, { accountId: order.id, charge });
    }

    if (domain) {
      return generateErrorResponse(this.res, {
        error: 'Domain already registered',
        errorCode: PUB_API_ERROR_CODES.DOMAIN_IS_ALREADY_REGISTERED,
        statusCode: HTTP_CODES.BAD_REQUEST,
      });
    }

    const { order, charge } = await this.createFreeAddressBuyOrder({
      publicKey,
      refProfileId: refProfile.id,
      address: fioAddress,
      domain: fioDomain,
    });

    return generateSuccessResponse(this.res, { accountId: order.id, charge });
  }

  async createFreeAddressBuyOrder({
    publicKey,
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
          total: normalizedPriceUsdc,
          roe,
          publicKey,
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
          nativeFio: nativeFio.toString(),
          price: normalizedPriceUsdc,
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
      charge = await Bitpay.getInvoice(payment.externalPaymentId);
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

  static get validationRules() {
    return {
      apiToken: ['string'],
      address: ['required', 'string'],
      referralCode: ['string'],
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