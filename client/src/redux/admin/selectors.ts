import { prefix } from './actions';
import { ReduxState } from '../init';

import { AdminUser, AdminUserProfile, OrderItem } from '../../types';

export const loading = (state: ReduxState): boolean => state[prefix].loading;
export const adminUsersList = (state: ReduxState): AdminUser[] =>
  state[prefix].adminUsersList;
export const adminUsersCount = (state: ReduxState): number =>
  state[prefix].adminUsersCount;
export const ordersList = (state: ReduxState): OrderItem[] =>
  state[prefix].ordersList;
export const ordersCount = (state: ReduxState): number =>
  state[prefix].ordersCount;
export const orderItem = (state: ReduxState): OrderItem =>
  state[prefix].orderItem;
export const adminUserProfile = (state: ReduxState): AdminUserProfile =>
  state[prefix].adminUserProfile;
