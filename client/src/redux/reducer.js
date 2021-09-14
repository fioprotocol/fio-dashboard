import { combineReducers } from 'redux';

import profile from './profile/reducer';
import form from './forms/reducer';
import router from './router/reducer';
import users from './users/reducer';
import edge from './edge/reducer';
import fio from './fio/reducer';
import modal from './modal/reducer';
import notifications from './notifications/reducer';
import registrations from './registrations/reducer';
import cart from './cart/reducer';
import refProfile from './refProfile/reducer';

export default combineReducers({
  profile,
  users,
  router,
  form,
  edge,
  fio,
  modal,
  notifications,
  registrations,
  cart,
  refProfile,
});
