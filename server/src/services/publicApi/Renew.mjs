import { FIOSDK } from '@fioprotocol/fiosdk';

import Base from '../Base';
import { destructAddress, formatChainDomain, generateErrorResponse } from '../../utils/publicApi.mjs';
import { PUB_API_ERROR_CODES } from '../../constants/pubApiErrorCodes.mjs';
import { Order, OrderItem, Payment, ReferrerProfile } from '../../models/index.mjs';
import { fioApi } from '../../external/fio.mjs';
import { getROE } from '../../external/roe.mjs';
import { FIO_ACTIONS } from '../../config/constants.js';
import { CURRENCY_CODES } from '../../constants/fio.mjs';
import { ORDER_USER_TYPES } from '../../constants/order.mjs';
import { HTTP_CODES } from '../../constants/general.mjs';

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

    if (!FIOSDK.isFioPublicKeyValid(publicKey)) {
      return generateErrorResponse(this.res, {
        error: 'Missing public key',
        errorCode: PUB_API_ERROR_CODES.NO_PUBLIC_KEY_SPECIFIED,
        statusCode: HTTP_CODES.BAD_REQUEST,
      });
    }

    if (type === 'account') {
      const domainFromChain = await fioApi.getFioDomain(fioDomain);
      const domain = formatChainDomain(domainFromChain);
      if (!domain || domain.account !== 'fio.oracle') {
        return generateErrorResponse(this.res, {
          error: 'Missing public key',
          errorCode: PUB_API_ERROR_CODES.NO_PUBLIC_KEY_SPECIFIED,
          statusCode: HTTP_CODES.BAD_REQUEST,
        });
      }
    }

    if (!(await fioApi.isAccountCouldBeRenewed(address))) {
      return generateErrorResponse(this.res, {
        error: `${type} not registered`,
        errorCode: PUB_API_ERROR_CODES.ADDRESS_CANT_BE_RENEWED,
        statusCode: HTTP_CODES.BAD_REQUEST,
      });
    }

    await this.createRenewOrder({
      publicKey,
      refProfileId: refProfile.id,
      address: fioAddress,
      domain: fioDomain,
    });
  }

  async createRenewOrder({ publicKey, refProfileId, address, domain }) {
    const roe = await getROE();
    const prices = await fioApi.getPrices(true);
    const nativeFio = !!address ? prices.addBundles : prices.renewDomain;
    const price = fioApi.convertFioToUsdc(nativeFio, roe);

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

      order.number = Order.generateNumber(order.id);

      await order.save({ transaction: t });

      const orderItem = await OrderItem.create(
        {
          orderId: order.id,
          address,
          domain,
          action:
            !!address
              ? FIO_ACTIONS.addBundledTransactions
              : FIO_ACTIONS.renewFioDomain,
          // TODO check can we remove toString?
          nativeFio: nativeFio.toString(),
          price,
          priceCurrency: CURRENCY_CODES.USDC,
          data: { orderUserType: ORDER_USER_TYPES.PARTNER_API_CLIENT },
        },
        { transaction: t },
      );

      const payment = await Payment.createForOrder(order, Payment.PROCESSOR.BITPAY, [orderItem]);

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
  }

  static get validationRules() {
    return {
      address: ['required', 'string'],
      referralCode: 'string',
      publicKey: 'string',
    };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return [];
  }
}
