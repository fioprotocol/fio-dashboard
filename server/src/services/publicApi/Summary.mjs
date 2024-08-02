import { FIOSDK } from '@fioprotocol/fiosdk';

import Base from '../Base';
import {
  generateErrorResponse,
  generateSummaryResponse,
  whereLastRow,
  whereNotOf,
} from '../../utils/publicApi.mjs';
import { PUB_API_ERROR_CODES } from '../../constants/pubApiErrorCodes.mjs';
import { HTTP_CODES } from '../../constants/general.mjs';
import {
  BlockchainTransaction,
  BlockchainTransactionEventLog,
  Order,
  OrderItem,
  Payment,
  PaymentEventLog,
  ReferrerProfile,
} from '../../models/index.mjs';

export default class Summary extends Base {
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

  async processing({
    publicKey,
    referralCode,
    externId,
    address,
    domain,
    type,
    accountPayId,
  }) {
    if (!address && !domain && !externId && !publicKey) {
      return generateErrorResponse(this.res, {
        error: `Invalid parameters address, domain, externId or publicKey is required`,
        errorCode: PUB_API_ERROR_CODES.INVALID_PARAMETERS,
        statusCode: HTTP_CODES.BAD_REQUEST,
      });
    }

    if (publicKey) {
      try {
        FIOSDK.isFioPublicKeyValid(publicKey);
      } catch (e) {
        return generateErrorResponse(this.res, {
          error: 'Invalid public key',
          errorCode: PUB_API_ERROR_CODES.NO_PUBLIC_KEY_SPECIFIED,
          statusCode: HTTP_CODES.BAD_REQUEST,
        });
      }
    }

    const orderItemWhere = {};

    if (address) {
      orderItemWhere.address = address;
    }

    if (domain) {
      orderItemWhere.domain = domain;
    }

    if (type) {
      orderItemWhere.action = type;
    }

    const orderWhere = {};

    if (publicKey) {
      orderWhere.publicKey = publicKey;
    }

    if (referralCode) {
      const refProfile = await ReferrerProfile.findOne({
        attributes: ['id'],
        where: {
          type: ReferrerProfile.TYPE.REF,
          code: referralCode,
        },
      });

      if (!refProfile) {
        return generateErrorResponse(this.res, {
          error: 'Referral code not found',
          errorCode: PUB_API_ERROR_CODES.REF_NOT_FOUND,
          statusCode: HTTP_CODES.NOT_FOUND,
        });
      }

      orderWhere.refProfileId = refProfile.id;
    }

    const paymentWhere = {
      ...whereNotOf('processor', [Payment.PROCESSOR.SYSTEM]),
    };

    if (accountPayId) {
      paymentWhere.id = accountPayId;
    }

    if (externId) {
      paymentWhere.externalId = externId;
    }

    const isItemFilterApplied = Object.keys(orderItemWhere).length > 0;
    const isOrderFilterApplied = Object.keys(orderWhere).length > 0;

    const result = await OrderItem.findAll({
      attributes: ['address', 'domain'],
      where: isItemFilterApplied ? orderItemWhere : undefined,
      order: [['id', 'desc']],
      include: [
        {
          attributes: ['id', 'publicKey'],
          model: Order,
          required: true,
          where: isOrderFilterApplied ? orderWhere : undefined,
          include: [
            {
              attributes: [
                'id',
                'orderId',
                'processor',
                'externalPaymentUrl',
                'price',
                'data',
                'externalId',
                'status',
                'createdAt',
              ],
              model: Payment,
              required: true,
              where: paymentWhere,
              include: [
                {
                  attributes: ['paymentId', 'statusNotes', 'createdAt'],
                  model: PaymentEventLog,
                  required: false,
                  where: whereLastRow(
                    'payment-event-logs',
                    'Order->Payments',
                    'paymentId',
                  ),
                },
              ],
            },
          ],
        },
        {
          attributes: ['id', 'action', 'txId', 'expiration', 'blockNum', 'status'],
          model: BlockchainTransaction,
          include: [
            {
              attributes: ['blockchainTransactionId', 'statusNotes'],
              model: BlockchainTransactionEventLog,
              required: false,
              where: whereLastRow(
                'blockchain-transaction-event-logs',
                'BlockchainTransactions',
                'blockchainTransactionId',
              ),
            },
          ],
        },
      ],
    });

    return generateSummaryResponse(result);
  }

  static get validationRules() {
    return {
      publicKey: 'string',
      referralCode: 'string',
      externId: 'string',
      address: 'string',
      domain: 'string',
      type: 'string',
      accountPayId: 'integer',
    };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return [];
  }
}
