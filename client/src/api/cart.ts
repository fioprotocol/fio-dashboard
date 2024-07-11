import Base from './base';

import { CartItem, NativePrices } from '../types';
import { DefaultSuccessResponse } from './responses';

type CartResponseType = {
  id?: string;
  items: CartItem[];
};

export default class Cart extends Base {
  addItem(data: {
    id?: string;
    item: CartItem;
    publicKey?: string;
    prices?: NativePrices;
    roe?: number;
    userId?: string;
  }): Promise<CartResponseType> {
    return this.apiClient.post('cart-add-item', data);
  }
  clearCart(id: string): Promise<DefaultSuccessResponse> {
    return this.apiClient.delete('cart-clear-cart', { id });
  }
  deleteItem(data: {
    id: string;
    itemId: string;
    prices: NativePrices;
    roe: number;
    userId?: string;
  }): Promise<CartResponseType> {
    return this.apiClient.patch('cart-delete-item', data);
  }
  getCart(id: string): Promise<CartResponseType> {
    return this.apiClient.get('cart', { id });
  }
  handleUsersFreeCartItems(data: {
    id: string;
    userId?: string;
    publicKey?: string;
  }): Promise<CartResponseType> {
    return this.apiClient.patch('cart-handle-free-items', data);
  }
  recalculateOnPriceUpdate(data: {
    id: string;
    prices: NativePrices;
    roe: number;
  }): Promise<CartResponseType> {
    return this.apiClient.put('cart-recalculate-updated-prices', data);
  }
  updateItemPeriod(data: {
    id: string;
    itemId: string;
    period: number;
    prices: NativePrices;
    roe: number;
  }): Promise<CartResponseType> {
    return this.apiClient.patch('cart-update-item-period', data);
  }
  updateUserId(cartId: string): Promise<CartResponseType> {
    return this.apiClient.patch('cart-update-user-id', { cartId });
  }
  createCartFromOrder(orderId: string): Promise<CartResponseType> {
    return this.apiClient.post('cart-create-from-order', { orderId });
  }
  getUsersCart(): Promise<CartResponseType> {
    return this.apiClient.get('get-users-cart');
  }
}
