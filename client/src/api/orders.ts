import Base from './base';

import {
  OrdersCreateResponse,
  OrdersUpdateResponse,
  UserOrdersListResponse,
} from './responses';
import { CreateOrderActionData } from '../redux/types';
import { PurchaseTxStatus, RegistrationResult } from '../types';

export default class Orders extends Base {
  create(data: CreateOrderActionData): Promise<OrdersCreateResponse> {
    return this.apiClient.post('orders', { data });
  }
  getList(limit: number, offset: number): Promise<UserOrdersListResponse> {
    return this.apiClient.get('orders', { limit, offset });
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
  getActive(): Promise<OrdersCreateResponse> {
    return this.apiClient.get(`orders/active`);
  }
  get(orderNumber: string): Promise<OrdersCreateResponse> {
    return this.apiClient.get(`orders/item/${orderNumber}`);
  }
}
