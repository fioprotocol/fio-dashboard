import Base from './base';

import { PaymentCreateResponse } from './responses';
import { PaymentOptionsProps } from '../types';

export default class Payments extends Base {
  create(data: {
    orderId: number | string;
    paymentProcessor: PaymentOptionsProps;
  }): Promise<PaymentCreateResponse> {
    return this.apiClient.post('payments', { data });
  }
}
