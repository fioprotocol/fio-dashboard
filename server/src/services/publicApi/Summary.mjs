import { FIOSDK } from '@fioprotocol/fiosdk';

import Base from '../Base';
import {
  generateErrorResponse,
  executeWithLogging,
  generateSummaryResponse,
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
      return await executeWithLogging({
        res: this.res,
        serviceName: 'Summary',
        args,
        showedFieldsFromResult: ['extern_id', 'extern_status', 'trx_id', 'trx_status'],
        executor: () => this.processing(args),
      });
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
    if (!address && !domain && !externId) {
      return generateErrorResponse(this.res, {
        error: `Invalid parameters address, domain, or externId is required`,
        errorCode: PUB_API_ERROR_CODES.INVALID_PARAMETERS,
        statusCode: HTTP_CODES.BAD_REQUEST,
      });
    }

    if (publicKey && !FIOSDK.isFioPublicKeyValid(publicKey)) {
      return generateErrorResponse(this.res, {
        error: 'Invalid public key',
        errorCode: PUB_API_ERROR_CODES.NO_PUBLIC_KEY_SPECIFIED,
        statusCode: HTTP_CODES.BAD_REQUEST,
      });
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

    const paymentWhere = {};

    if (accountPayId) {
      paymentWhere.id = accountPayId;
    }

    if (externId) {
      paymentWhere.externalId = externId;
    }

    const result = await OrderItem.findAll({
      attributes: ['address', 'domain'],
      where: Object.keys(orderItemWhere).length > 0 ? orderItemWhere : undefined,
      order: [['id', 'desc']],
      include: [
        {
          attributes: ['id', 'publicKey'],
          model: Order,
          where: Object.keys(orderWhere).length > 0 ? orderWhere : undefined,
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
              ],
              model: Payment,
              limit: 1,
              order: [['createdAt', 'DESC']],
              where: Object.keys(paymentWhere).length > 0 ? paymentWhere : undefined,
              include: [
                {
                  attributes: ['paymentId', 'statusNotes', 'createdAt'],
                  model: PaymentEventLog,
                  required: false,
                  limit: 1,
                  order: [['createdAt', 'DESC']],
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
              limit: 1,
              order: [['createdAt', 'DESC']],
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
