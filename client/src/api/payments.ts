import Base from './base';

import { PaymentCreateResponse } from './responses';
import { PurchaseProvider } from '../types';

export default class Payments extends Base {
  create(data: {
    orderId: number | string;
    paymentProcessor: PurchaseProvider;
  }): Promise<PaymentCreateResponse> {
    return this.apiClient.post('payments', { data });
  }
}
