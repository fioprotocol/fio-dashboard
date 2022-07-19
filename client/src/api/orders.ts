import Base from './base';

import { OrdersCreateResponse } from './responses';
import { CreateOrderActionData } from '../redux/types';

export default class Orders extends Base {
  create(data: CreateOrderActionData): Promise<OrdersCreateResponse> {
    return this.apiClient.post('orders', { data });
  }
}
