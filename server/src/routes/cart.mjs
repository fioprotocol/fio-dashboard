import { makeServiceRunner } from '../tools';

import AddItem from '../services/cart/AddItem.mjs';
import ClearCart from '../services/cart/ClearCart.mjs';
import CreateCartFromOrder from '../services/cart/CreateCartFromOrder.mjs';
import DeleteItem from '../services/cart/DeleteItem.mjs';
import GetCart from '../services/cart/GetCart.mjs';
import HandleUsersFreeCartItems from '../services/cart/HandleUsersFreeCartItems.mjs';
import RecalculateOnPriceUpdate from '../services/cart/RecalculateOnPriceUpdate.mjs';
import UpdateItemPeriod from '../services/cart/UpdateItemPeriod.mjs';

export default {
  addItem: makeServiceRunner(AddItem, req => req.body),
  clearCart: makeServiceRunner(ClearCart, req => req.body),
  createCartFromOrder: makeServiceRunner(CreateCartFromOrder, req => req.body),
  deleteItem: makeServiceRunner(DeleteItem, req => req.body),
  getCart: makeServiceRunner(GetCart, req => req.query),
  handleUsersFreeCartItems: makeServiceRunner(HandleUsersFreeCartItems, req => req.body),
  recalculateOnPriceUpdate: makeServiceRunner(RecalculateOnPriceUpdate, req => req.body),
  updateItemPeriod: makeServiceRunner(UpdateItemPeriod, req => req.body),
};
