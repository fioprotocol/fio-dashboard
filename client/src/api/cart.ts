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
  deleteItem({ id, itemId }: { id: string; itemId: string }): Promise<any> {
    return this.apiClient.patch('cart-delete-item', { id, itemId });
  }
  getCart(id: string): Promise<any> {
    return this.apiClient.get('cart', { id });
  }
  setOldCart(id: string): Promise<any> {
    return this.apiClient.patch('cart-set-old-cart', { id });
  }
  updateItemPeriod(data: {
    id: string;
    itemId: string;
    period: number;
  }): Promise<any> {
    return this.apiClient.patch('cart-update-item-period', data);
  }
  updateUserId(cartId: string): Promise<any> {
    return this.apiClient.patch('cart-update-user-id', { cartId });
  }
}
