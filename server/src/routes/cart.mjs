import { makeServiceRunner } from '../tools';

import AddItem from '../services/cart/AddItem.mjs';
import ClearCart from '../services/cart/ClearCart.mjs';
import CreateCartFromOrder from '../services/cart/CreateCartFromOrder.mjs';
import DeleteItem from '../services/cart/DeleteItem.mjs';
import GetCart from '../services/cart/GetCart.mjs';
import GetUsersCart from '../services/cart/GetUsersCart.mjs';
import HandleUsersFreeCartItems from '../services/cart/HandleUsersFreeCartItems.mjs';
import RecalculateOnPriceUpdate from '../services/cart/RecalculateOnPriceUpdate.mjs';
import UpdateItemPeriod from '../services/cart/UpdateItemPeriod.mjs';
import UpdateUserId from '../services/cart/UpdateUserId.mjs';

export default {
  addItem: makeServiceRunner(AddItem, req => ({
    ...req.body,
    cookies: req.cookies,
  })),
  clearCart: makeServiceRunner(ClearCart, req => req.body),
  createCartFromOrder: makeServiceRunner(CreateCartFromOrder, req => req.body),
  deleteItem: makeServiceRunner(DeleteItem, req => ({
    ...req.body,
    cookies: req.cookies,
  })),
  getCart: makeServiceRunner(GetCart, req => req.query),
  getUsersCart: makeServiceRunner(GetUsersCart),
  handleUsersFreeCartItems: makeServiceRunner(HandleUsersFreeCartItems, req => ({
    ...req.body,
    cookies: req.cookies,
  })),
  recalculateOnPriceUpdate: makeServiceRunner(RecalculateOnPriceUpdate, req => req.body),
  updateItemPeriod: makeServiceRunner(UpdateItemPeriod, req => req.body),
  updateUserId: makeServiceRunner(UpdateUserId, req => req.body),
};
