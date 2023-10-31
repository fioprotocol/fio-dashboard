import { makeServiceRunner } from '../tools';

import AddItem from '../services/cart/AddItem.mjs';
import ClearCart from '../services/cart/ClearCart.mjs';
import DeleteItem from '../services/cart/DeleteItem.mjs';
import GetCart from '../services/cart/GetCart.mjs';
import HandleUsersFreeCartItems from '../services/cart/HandleUsersFreeCartItems.mjs';
import SetOldCart from '../services/cart/SetOldCart.mjs';
import UpdateItemPeriod from '../services/cart/UpdateItemPeriod.mjs';
import UpdateUserId from '../services/cart/UpdateUserId.mjs';

export default {
  addItem: makeServiceRunner(AddItem, req => req.body),
  clearCart: makeServiceRunner(ClearCart, req => req.body),
  deleteItem: makeServiceRunner(DeleteItem, req => req.body),
  getCart: makeServiceRunner(GetCart, req => req.query),
  handleUsersFreeCartItems: makeServiceRunner(HandleUsersFreeCartItems, req => req.body),
  setOldCart: makeServiceRunner(SetOldCart, req => req.body),
  updateItemPeriod: makeServiceRunner(UpdateItemPeriod, req => req.body),
  updateUserId: makeServiceRunner(UpdateUserId, req => req.body),
};
