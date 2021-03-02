import { combineReducers } from 'redux';

import profile from './profile/reducer';
import form from './forms/reducer';
import router from './router/reducer';
import users from './users/reducer';

export default combineReducers({
  profile,
  users,
  router,
  form,
});
