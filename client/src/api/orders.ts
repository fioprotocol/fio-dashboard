import Base from './base';

import {
  OrdersCreateResponse,
  OrderGetResponse,
  OrdersUpdateResponse,
  UserOrdersListResponse,
} from './responses';
import { CreateOrderActionData } from '../redux/types';
import { PurchaseTxStatus, RegistrationResult } from '../types';

export default class Orders extends Base {
  create(data: CreateOrderActionData): Promise<OrdersCreateResponse> {
    return this.apiClient.post('orders', { data });
  }
  getList(data: {
    publicKey?: string;
    limit: number;
    offset: number;
    userId?: string;
  }): Promise<UserOrdersListResponse> {
    return this.apiClient.get('orders', data);
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
  getActive(data?: { publicKey?: string }): Promise<OrdersCreateResponse> {
    return this.apiClient.get(`orders/active`, { data });
  }
  get(id: string): Promise<OrderGetResponse> {
    return this.apiClient.get(`orders/item/${id}`);
  }
}
