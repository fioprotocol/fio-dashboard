import { FIOSDK } from '@fioprotocol/fiosdk';

import Base from '../Base';
import {
  createCallWithRetry,
  destructAddress,
  formatChainDomain,
  generateErrorResponse,
  generateSuccessResponse,
} from '../../utils/publicApi.mjs';
import { PUB_API_ERROR_CODES } from '../../constants/pubApiErrorCodes.mjs';
import { Order, OrderItem, Payment, ReferrerProfile } from '../../models/index.mjs';
import { fioApi } from '../../external/fio.mjs';
import { getROE } from '../../external/roe.mjs';
import { FIO_ACTIONS } from '../../config/constants.js';
import { CHAIN_CODES, CURRENCY_CODES } from '../../constants/fio.mjs';
import { ORDER_USER_TYPES } from '../../constants/order.mjs';
import { HTTP_CODES } from '../../constants/general.mjs';
import { normalizePriceForBitPayInTestNet } from '../../utils/payment.mjs';
import Bitpay from '../../external/payment-processor/bitpay.mjs';

export default class Renew extends Base {
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

  async processing({ address, referralCode, publicKey }) {
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

    if (!publicKey) {
      if (type === 'account') {
        publicKey = await FIOSDK.getPublicAddress(
          fioAddress,
          CHAIN_CODES.FIO,
          CURRENCY_CODES.FIO,
        );
      } else {
        const domainFromChain = await fioApi
          .getFioDomain(fioDomain)
          .then(formatChainDomain);
        publicKey = await fioApi.getPublicAddressByAccount(domainFromChain.account);
      }
    }

    if (!FIOSDK.isFioPublicKeyValid(publicKey)) {
      const err = {
        error: 'Missing public key',
        errorCode: PUB_API_ERROR_CODES.NO_PUBLIC_KEY_SPECIFIED,
        statusCode: HTTP_CODES.BAD_REQUEST,
      };

      if (type === 'account') {
        const domainFromChain = await fioApi
          .getFioDomain(fioDomain)
          .then(formatChainDomain);

        if (
          !domainFromChain ||
          !domainFromChain.account ||
          domainFromChain.account !== 'fio.oracle'
        ) {
          return generateErrorResponse(this.res, err);
        }
      } else {
        return generateErrorResponse(this.res, err);
      }
    }

    if (!(await fioApi.isAccountCouldBeRenewed(address))) {
      return generateErrorResponse(this.res, {
        error: `${type} not registered`,
        errorCode: PUB_API_ERROR_CODES.ADDRESS_CANT_BE_RENEWED,
        statusCode: HTTP_CODES.BAD_REQUEST,
      });
    }

    const { order, charge } = await this.createRenewOrder({
      publicKey,
      refProfileId: refProfile.id,
      address: fioAddress,
      domain: fioDomain,
    });

    return generateSuccessResponse(this.res, { accountId: order.id, charge });
  }

  async createRenewOrder({ publicKey, refProfileId, address, domain }) {
    const roe = await getROE();
    const prices = await fioApi.getPrices(true);
    const nativeFio = address ? prices.addBundles : prices.renewDomain;
    const priceUsdc = fioApi.convertFioToUsdc(nativeFio, roe);
    const normalizedPriceUsdc = normalizePriceForBitPayInTestNet(priceUsdc);

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

      orderItem = await OrderItem.create(
        {
          orderId: order.id,
          address,
          domain,
          action: address
            ? FIO_ACTIONS.addBundledTransactions
            : FIO_ACTIONS.renewFioDomain,
          nativeFio: nativeFio.toString(),
          price: normalizedPriceUsdc,
          priceCurrency: CURRENCY_CODES.USDC,
          data: { orderUserType: ORDER_USER_TYPES.PARTNER_API_CLIENT },
        },
        { transaction: t },
      );
    });

    const payment = await Payment.createForOrder(order, Payment.PROCESSOR.BITPAY, [
      orderItem,
    ]);

    const charge = await createCallWithRetry(
      6,
      1000,
    )(() => Bitpay.getInvoice(payment.externalPaymentId));

    return { order, orderItem, payment, charge };
  }

  static get validationRules() {
    return {
      address: ['required', 'string'],
      referralCode: ['required', 'string'],
      publicKey: ['string'],
    };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return ['success'];
  }
}
