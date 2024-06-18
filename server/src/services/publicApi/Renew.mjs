import { FIOSDK } from '@fioprotocol/fiosdk';

import Base from '../Base';
import { formatChainDomain, generateResponse } from '../../utils/publicApi.mjs';
import { PUB_API_ERROR_CODES } from '../../constants/pubApiErrorCodes.mjs';
import { Order, OrderItem, ReferrerProfile } from '../../models/index.mjs';
import { fioApi } from '../../external/fio.mjs';
import { getROE } from '../../external/roe.mjs';
import { FIO_ACTIONS } from '../../config/constants.js';
import { CURRENCY_CODES } from '../../constants/fio.mjs';
import { ORDER_USER_TYPES } from '../../constants/order.mjs';

export default class Renew extends Base {
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

  async processing({ address, referralCode, publicKey }) {
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
      (fioAddress && !FIOSDK.isFioAddressValid(fioAddress)) ||
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

    if (type === 'account') {
      const domainFromChain = await fioApi.getFioDomain(fioDomain);
      const domain = formatChainDomain(domainFromChain);
      if (!domain || domain.account !== 'fio.oracle') {
        return generateResponse({
          error: 'Missing public key',
          errorCode: PUB_API_ERROR_CODES.NO_PUBLIC_KEY_SPECIFIED,
        });
      }
    }

    if (!(await fioApi.isAccountCouldBeRenewed(address))) {
      return generateResponse({
        error: `${type} not registered`,
        errorCode: PUB_API_ERROR_CODES.ADDRESS_CANT_BE_RENEWED,
      });
    }

    await this.createRenewOrder({
      type,
      publicKey,
      refProfileId: refProfile.id,
      address: fioAddress,
      domain: fioDomain,
    });
  }

  async createRenewOrder({ type, publicKey, refProfileId, address, domain }) {
    const roe = await getROE();
    const prices = await fioApi.getPrices(true);
    const price = fioApi.convertFioToUsdc(
      type === 'account' ? prices.addBundles : prices.renewDomain,
      roe,
    );

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

      await OrderItem.create(
        {
          orderId: order.id,
          address,
          domain,
          action:
            type === 'account'
              ? FIO_ACTIONS.addBundledTransactions
              : FIO_ACTIONS.renewFioDomain,
          nativeFio:
            type === 'account'
              ? prices.addBundles.toString()
              : prices.renewDomain.toString(),
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
