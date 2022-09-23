import Base from '../Base';

import { Payment, Order } from '../../models';

import X from '../Exception.mjs';

import logger from '../../logger.mjs';

export default class PaymentsCancel extends Base {
  static get validationRules() {
    return {
      id: 'integer',
    };
  }

  async execute({ id }) {
    const payment = await Payment.findOne({
      where: {
        id,
        status: Payment.STATUS.PENDING,
        spentType: Payment.SPENT_TYPE.ORDER,
      },
      include: [{ model: Order, where: { userId: this.context.id } }],
    });

    if (!payment) {
      throw new X({
        code: 'NOT_FOUND',
        fields: {
          id: 'NOT_FOUND',
        },
      });
    }

    try {
      const paymentProcessor = Payment.getPaymentProcessor(payment.processor);
      await paymentProcessor.cancel(payment.externalId);
    } catch (e) {
      logger.error(e.message);
    }

    return {
      data: null,
    };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return ['data'];
  }
}
