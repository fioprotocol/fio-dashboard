import { FIOSDK, GenericAction } from '@fioprotocol/fiosdk';
import Sequelize from 'sequelize';

import Base from '../Base';
import {
  BlockchainTransaction,
  Domain,
  FreeAddress,
  Order,
  OrderItem,
  OrderItemStatus,
  Payment,
  ReferrerProfile,
  ReferrerProfileApiToken,
  Var,
} from '../../models';
import { fioApi } from '../../external/fio';
import { getROE } from '../../external/roe';
import Bitpay from '../../external/payment-processor/bitpay.mjs';
import emailSender from '../emailSender.mjs';
import logger from '../../logger.mjs';
import { templates } from '../../emails/emailTemplate.mjs';

import {
  createCallWithRetry,
  destructAddress,
  findDomainInRefProfile,
  formatChainAddress,
  formatChainDomain,
  generateErrorResponse,
  generateSuccessResponse,
} from '../../utils/publicApi';
import {
  normalizePriceForBitPay,
  prepareOrderWithFioPaymentForExecution,
} from '../../utils/payment.mjs';
import { getExistUsersByPublicKeyOrCreateNew } from '../../utils/user.mjs';
import { isDomainExpired, normalizeFioHandle } from '../../utils/fio.mjs';
import { handleRefProfileApiTokenAndLegacyHash } from '../../utils/referrer-profile.mjs';

import { PUB_API_ERROR_CODES } from '../../constants/pubApiErrorCodes';
import { CURRENCY_CODES } from '../../constants/fio.mjs';
import { ORDER_USER_TYPES } from '../../constants/order.mjs';
import { HTTP_CODES, REGSITE_NOTIF_EMAIL_KEY } from '../../constants/general.mjs';
import { DAY_MS, FIO_ADDRESS_DELIMITER } from '../../config/constants.js';

export default class BuyAddress extends Base {
  async execute(args) {
    try {
      return await this.processing(args);
    } catch (e) {
      logger.error(e);
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
      statusCode: HTTP_CODES.BAD_REQUEST, // NOT_FOUND, fix server to send proper code
    };

    if (!referralCode) {
      return generateErrorResponse(this.res, refNotFoundRes);
    }

    const refProfile = await ReferrerProfile.findOne({
      where: {
        type: ReferrerProfile.TYPE.REF,
        code: referralCode,
      },
      include: [{ model: ReferrerProfileApiToken, as: 'apiTokens' }],
    });

    if (!refProfile) {
      return generateErrorResponse(this.res, refNotFoundRes);
    }

    for (const refProfileApiData of refProfile.apiTokens) {
      !refProfileApiData.token &&
        refProfileApiData.legacyHash &&
        apiToken &&
        (await handleRefProfileApiTokenAndLegacyHash({
          refCode: refProfile.code,
          apiToken,
          refProfileApiData,
        }));
    }

    if (!refProfile.hasApiAccess()) {
      return generateErrorResponse(this.res, {
        error: `Access by api deactivated`,
        errorCode: PUB_API_ERROR_CODES.REF_API_ACCESS_DEACTIVATED,
        statusCode: HTTP_CODES.BAD_REQUEST, // FORBIDDEN, fix server to send proper code
      });
    }

    let apiProfile = null;
    if (apiToken) {
      apiProfile = refProfile.getApiProfile(apiToken);
      if (!apiProfile) {
        return generateErrorResponse(this.res, {
          error: `Invalid api token`,
          errorCode: PUB_API_ERROR_CODES.INVALID_API_TOKEN,
          statusCode: HTTP_CODES.BAD_REQUEST,
        });
      }
    }

    const normalizedFioHandle = normalizeFioHandle(address);
    const { type, fioAddress, fioDomain } = destructAddress(normalizedFioHandle);

    try {
      fioAddress
        ? FIOSDK.isFioAddressValid(normalizedFioHandle)
        : FIOSDK.isFioDomainValid(fioDomain);

      if (fioAddress && !(await fioApi.validateFioAddress(fioAddress, fioDomain))) {
        throw new Error('Invalid FIO Address');
      }
    } catch (e) {
      return generateErrorResponse(this.res, {
        error: `Invalid ${type}`,
        errorCode: PUB_API_ERROR_CODES.INVALID_FIO_NAME,
        statusCode: HTTP_CODES.BAD_REQUEST,
      });
    }

    try {
      FIOSDK.isFioPublicKeyValid(publicKey);
    } catch (e) {
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
        .getFioAddress(normalizedFioHandle)
        .then(formatChainAddress);

      if (addressFromChain) {
        return generateErrorResponse(this.res, {
          error: 'Address already registered',
          errorCode: PUB_API_ERROR_CODES.ADDRESS_IS_ALREADY_REGISTERED,
          statusCode: HTTP_CODES.BAD_REQUEST,
        });
      }

      const allowSameAccountRegistration = await this.allowSameAccountRegistration(
        publicKey,
        refProfile,
        normalizedFioHandle,
      );

      if (!allowSameAccountRegistration) {
        return generateErrorResponse(this.res, {
          error: `You have already sent a request to register a FIO Handle for that domain`,
          errorCode: PUB_API_ERROR_CODES.ALREADY_SENT_REGISTRATION_REQ_FOR_ACCOUNT,
          statusCode: HTTP_CODES.BAD_REQUEST,
        });
      }

      const [user] = await getExistUsersByPublicKeyOrCreateNew(publicKey, referralCode);

      let isFreeRegistration = false;

      if (apiToken && apiProfile && domainFromChain) {
        const refDomain = findDomainInRefProfile(refProfile, fioDomain);

        if (refDomain) {
          isFreeRegistration =
            !refDomain.isPremium &&
            (await this.isFreeAddressNotExist({
              userId: user.id,
              freeId: user.username,
              publicKey,
              fioDomain,
              enableCompareByDomainName: refDomain.isFirstRegFree,
            }));
        } else {
          const dashboardDomains = await Domain.getDashboardDomains();
          const dashboardDomain = dashboardDomains.find(it => it.name === fioDomain);

          isFreeRegistration =
            dashboardDomain &&
            !dashboardDomain.isPremium &&
            (await this.isFreeAddressNotExist({
              userId: user.id,
              freeId: user.username,
              publicKey,
              fioDomain,
              enableCompareByDomainName:
                dashboardDomain && dashboardDomain.isFirstRegFree,
            }));
        }

        if (isFreeRegistration && apiProfile.dailyFreeLimit) {
          const TODAY_START = new Date().setHours(0, 0, 0, 0);
          const NOW = new Date();
          const freeRegs = await Order.count({
            where: {
              status: {
                [Sequelize.Op.in]: [
                  Order.STATUS.SUCCESS,
                  Order.STATUS.TRANSACTION_PENDING,
                  Order.STATUS.NEW,
                ],
              },
              total: '0',
              refProfileId: refProfile.id,
              data: { orderUserType: ORDER_USER_TYPES.PARTNER_API_CLIENT },
              createdAt: {
                [Sequelize.Op.gt]: TODAY_START,
                [Sequelize.Op.lt]: NOW,
              },
            },
          });

          if (freeRegs >= apiProfile.dailyFreeLimit) {
            await this.sendNotification(apiProfile, refProfile);

            return generateErrorResponse(this.res, {
              error: 'Daily limit of Free FIO Handles reached.',
              errorCode: PUB_API_ERROR_CODES.FREE_API_LIMIT_REACHED,
              statusCode: HTTP_CODES.BAD_REQUEST, // FORBIDDEN, fix server to send proper code
            });
          }
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
    const prices = await fioApi.getPrices();
    const nativeFio = address
      ? isDomainExist
        ? prices.address
        : prices.combo
      : prices.domain;
    const priceUsdc = fioApi.convertFioToUsdc(nativeFio, roe);
    const normalizedPriceUsdc = isFree ? priceUsdc : normalizePriceForBitPay(priceUsdc);

    let orderItem, order;

    await Order.sequelize.transaction(async t => {
      order = await Order.create(
        {
          status: Order.STATUS.NEW,
          total: isFree ? '0' : normalizedPriceUsdc,
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
          ? GenericAction.registerFioAddress
          : GenericAction.registerFioDomainAddress
        : GenericAction.registerFioDomain;

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

  async isFreeAddressNotExist({
    userId,
    freeId,
    publicKey,
    fioDomain,
    enableCompareByDomainName,
  }) {
    const freeAddressesByUserId = freeId ? await FreeAddress.getItems({ freeId }) : [];
    const freeAddressesByPublicKey = publicKey
      ? await FreeAddress.getItems({ freeId: publicKey })
      : [];

    const freeAddresses = [...freeAddressesByUserId, ...freeAddressesByPublicKey];

    const orders = await Order.findAll({
      attributes: ['id'],
      where: {
        userId,
        status: {
          [Sequelize.Op.in]: [
            Order.STATUS.SUCCESS,
            Order.STATUS.TRANSACTION_PENDING,
            Order.STATUS.NEW,
          ],
        },
        total: '0',
      },
      include: [{ model: OrderItem, attributes: ['id', 'domain'] }],
    });

    const freeRegisteredAddressWithDomainInOrders = enableCompareByDomainName
      ? orders.find(order => order.OrderItems.find(({ domain }) => domain === fioDomain))
      : null;

    const freeRegisteredAddressWithDomainInFreeAddresses = enableCompareByDomainName
      ? freeAddresses.find(
          freeAddress => freeAddress.name.split(FIO_ADDRESS_DELIMITER)[1] === fioDomain,
        )
      : null;

    return enableCompareByDomainName
      ? !freeRegisteredAddressWithDomainInOrders &&
          !freeRegisteredAddressWithDomainInFreeAddresses
      : !orders.length && !freeAddresses.length;
  }

  async allowSameAccountRegistration(publicKey, refProfile, address) {
    const { fioAddress, fioDomain } = destructAddress(address);

    // Step 1: Get all orders for this user/referrer (lightweight query)
    const orders = await Order.findAll({
      attributes: ['id', 'status'],
      where: {
        publicKey,
        refProfileId: refProfile.id,
        status: {
          [Sequelize.Op.notIn]: [
            Order.STATUS.SUCCESS,
            Order.STATUS.FAILED,
            Order.STATUS.CANCELED,
          ],
        },
      },
    });

    if (!orders.length) {
      return true; // No existing orders, allow registration
    }

    // Step 2: Find matching OrderItems for these orders
    const orderIds = orders.map(order => order.id);

    const matchingOrderItems = await OrderItem.findAll({
      where: {
        orderId: { [Sequelize.Op.in]: orderIds },
        address: fioAddress,
        domain: fioDomain,
      },
      include: [
        {
          model: OrderItemStatus,
          where: {
            txStatus: {
              [Sequelize.Op.notIn]: [
                BlockchainTransaction.STATUS.FAILED,
                BlockchainTransaction.STATUS.SUCCESS,
              ],
            },
            paymentStatus: {
              [Sequelize.Op.notIn]: [
                Payment.STATUS.CANCELLED,
                Payment.STATUS.EXPIRED,
                Payment.STATUS.FAILED,
              ],
            },
          },
        },
      ],
    });

    if (!matchingOrderItems.length) {
      return true; // No matching order items, allow registration
    }

    // Step 3: Get Payment info for ALL matching orders
    const matchingOrderIds = [...new Set(matchingOrderItems.map(item => item.orderId))];
    const payments = await Payment.findAll({
      attributes: ['id', 'processor', 'externalId', 'status', 'orderId'],
      where: {
        orderId: { [Sequelize.Op.in]: matchingOrderIds },
      },
    });

    // Check ALL order items and their payments
    let allowToRegister = true;

    for (const orderItem of matchingOrderItems) {
      const relatedPayments = payments.filter(p => p.orderId === orderItem.orderId);

      for (const paymentInfo of relatedPayments) {
        // If any payment is completed, block registration
        if (paymentInfo.status === Payment.STATUS.COMPLETED) {
          allowToRegister = false;
          break;
        }

        // If payment is pending/new, check if it's actually still valid
        if (
          paymentInfo.status === Payment.STATUS.PENDING ||
          paymentInfo.status === Payment.STATUS.NEW
        ) {
          if (
            paymentInfo.processor === Payment.PROCESSOR.BITPAY &&
            paymentInfo.externalId
          ) {
            const invoice = await Bitpay.getInvoice(paymentInfo.externalId);
            // If invoice is NOT expired, this payment is still active - block registration
            if (invoice && invoice.status !== 'expired') {
              allowToRegister = false;
              break;
            }
          } else {
            // Non-BitPay pending/new payments block registration
            allowToRegister = false;
            break;
          }
        }

        // Note: Cancelled/Failed/Expired payments don't block registration
      }

      if (!allowToRegister) break; // Exit early if we found a blocking payment
    }

    return allowToRegister;
  }

  async sendNotification(apiProfile, refProfile) {
    try {
      if (
        (apiProfile.lastNotificationDate &&
          Var.updateRequired(apiProfile.lastNotificationDate, DAY_MS)) ||
        !apiProfile.lastNotificationDate
      ) {
        const notifEmail = await Var.getValByKey(REGSITE_NOTIF_EMAIL_KEY);
        await emailSender.send(templates.freeLimitReached, notifEmail, {
          refProfileName: refProfile.label,
          limit: apiProfile.dailyFreeLimit,
          lastApiToken: `${apiProfile.token}`.slice(-4),
        });

        await apiProfile.update({
          lastNotificationDate: new Date().setHours(0, 0, 0, 0),
        });
      }
    } catch (err) {
      logger.error(err);
    }
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
