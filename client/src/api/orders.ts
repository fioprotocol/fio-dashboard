import Base from './base';

import {
  OrdersCreateResponse,
  OrderGetResponse,
  OrdersUpdateResponse,
  OrdersUpdatePubKeyResponse,
  UserOrdersListResponse,
} from './responses';
import { CreateOrderActionData } from '../redux/types';
import { RegistrationRegistered, VerifyParams } from '../types';
import { SignedTxArgs } from './fio';

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
    orderId?: number;
    results: RegistrationRegistered[];
    captcha?: VerifyParams;
  }): Promise<OrdersUpdateResponse> {
    return this.apiClient.post(`orders/process-payment`, { data });
  }
  preparedTx(
    data: {
      fioName: string;
      action: string;
      data: {
        signedTx?: SignedTxArgs;
        signingWalletPubKey?: string;
      };
    }[],
  ): Promise<OrdersUpdateResponse> {
    return this.apiClient.post(`orders/prepared-tx`, { data });
  }
  updatePubKey(publicKey: string): Promise<OrdersUpdatePubKeyResponse> {
    return this.apiClient.post(`orders/update/public-key`, {
      publicKey,
    });
  }
  getActive(): Promise<OrdersCreateResponse> {
    return this.apiClient.get('orders/active');
  }
  get(id: string, publicKey: string): Promise<OrderGetResponse> {
    return this.apiClient.get(`orders/item/${id}/${publicKey}`);
  }
  cancel(): Promise<{ success: boolean }> {
    return this.apiClient.delete(`orders/active`);
  }
}
