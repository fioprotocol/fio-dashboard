import Base from './base';

import { OrdersCreateResponse, OrdersUpdateResponse } from './responses';
import { CreateOrderActionData } from '../redux/types';
import { PurchaseTxStatus, RegistrationResult } from '../types';

export default class Orders extends Base {
  create(data: CreateOrderActionData): Promise<OrdersCreateResponse> {
    return this.apiClient.post('orders', { data });
  }
  update(
    id: number,
    data: {
      status?: PurchaseTxStatus;
      publicKey?: string;
      results?: RegistrationResult;
    },
  ): Promise<OrdersUpdateResponse> {
    return this.apiClient.post(`orders/update/${id}`, { data });
  }
}
