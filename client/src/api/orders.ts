import Base from './base';

import {
  OrdersCreateResponse,
  OrderGetResponse,
  OrdersUpdateResponse,
  UserOrdersListResponse,
} from './responses';
import { CreateOrderActionData } from '../redux/types';
import { RegistrationResult } from '../types';

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
  processPayment(data: {
    results: RegistrationResult;
  }): Promise<OrdersUpdateResponse> {
    return this.apiClient.post(`orders/process-payment`, { data });
  }
  updatePubKey(publicKey: string): Promise<OrdersCreateResponse> {
    return this.apiClient.post(`orders/update/public-key`, {
      publicKey,
    });
  }
  getActive(data?: {
    publicKey?: string;
    userId?: string;
  }): Promise<OrdersCreateResponse> {
    return this.apiClient.get(`orders/active`, data);
  }
  get(id: string, publicKey: string): Promise<OrderGetResponse> {
    return this.apiClient.get(`orders/item/${id}/${publicKey}`);
  }
  cancel(): Promise<{ success: boolean }> {
    return this.apiClient.delete(`orders/active`);
  }
}
