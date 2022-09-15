import Base from './base';

import { PaymentCreateResponse } from './responses';
import { PaymentProvider } from '../types';

export default class Payments extends Base {
  create(data: {
    orderId: number | string;
    paymentProcessor: PaymentProvider;
  }): Promise<PaymentCreateResponse> {
    return this.apiClient.post('payments', { data });
  }
}
