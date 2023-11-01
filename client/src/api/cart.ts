import Base from './base';

import { CartItem, NativePrices } from '../types';

export default class Cart extends Base {
  addItem({
    id,
    item,
    prices,
    roe,
  }: {
    id: string;
    item: CartItem;
    prices?: NativePrices;
    roe?: number;
  }): Promise<any> {
    return this.apiClient.post('cart-add-item', { id, item, prices, roe });
  }
  clearCart(id: string): Promise<any> {
    return this.apiClient.delete('cart-clear-cart', { id });
  }
  deleteItem(data: {
    id: string;
    itemId: string;
    prices: NativePrices;
    roe: number;
  }): Promise<any> {
    return this.apiClient.patch('cart-delete-item', data);
  }
  getCart(id: string): Promise<any> {
    return this.apiClient.get('cart', { id });
  }
  handleUsersFreeCartItems(data: {
    id: string;
    userId?: string;
  }): Promise<any> {
    return this.apiClient.patch('cart-handle-free-items', data);
  }
  recalculateOnPriceUpdate(data: {
    id: string;
    prices: NativePrices;
    roe: number;
  }): Promise<any> {
    return this.apiClient.put('cart-recalculate-updated-prices', data);
  }
  setOldCart(id: string): Promise<any> {
    return this.apiClient.patch('cart-set-old-cart', { id });
  }
  updateItemPeriod(data: {
    id: string;
    itemId: string;
    period: number;
    prices: NativePrices;
    roe: number;
  }): Promise<any> {
    return this.apiClient.patch('cart-update-item-period', data);
  }
  updateUserId(cartId: string): Promise<any> {
    return this.apiClient.patch('cart-update-user-id', { cartId });
  }
}
