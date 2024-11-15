import Base from './base';

import { CartItem } from '../types';
import { DefaultSuccessResponse } from './responses';

type CartResponseType = {
  items: CartItem[];
};

export default class Cart extends Base {
  addItem(data: {
    item: CartItem;
    publicKey?: string;
    refCode?: string;
  }): Promise<CartResponseType> {
    return this.apiClient.post('cart-add-item', data);
  }
  clearCart(): Promise<DefaultSuccessResponse> {
    return this.apiClient.delete('cart-clear-cart');
  }
  deleteItem(data: {
    itemId: string;
    refCode?: string;
  }): Promise<CartResponseType> {
    return this.apiClient.patch('cart-delete-item', data);
  }
  getCart(): Promise<CartResponseType> {
    return this.apiClient.get('cart');
  }
  handleUsersFreeCartItems(data: {
    publicKey?: string;
    refCode?: string;
  }): Promise<CartResponseType> {
    return this.apiClient.patch('cart-handle-free-items', data);
  }
  recalculateOnPriceUpdate(): Promise<CartResponseType> {
    return this.apiClient.patch('cart-recalculate-updated-prices', {});
  }
  updateItemPeriod(data: {
    itemId: string;
    period: number;
  }): Promise<CartResponseType> {
    return this.apiClient.patch('cart-update-item-period', data);
  }
  createCartFromOrder(orderId: string): Promise<CartResponseType> {
    return this.apiClient.post('cart-create-from-order', { orderId });
  }
}
