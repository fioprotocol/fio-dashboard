import { prefix } from './actions';
import { ReduxState } from '../init';

import {
  AdminUser,
  AdminUserProfile,
  FioApiUrl,
  OrderDetails,
  User,
} from '../../types';

export const loading = (state: ReduxState): boolean => state[prefix].loading;
export const adminUsersList = (state: ReduxState): AdminUser[] =>
  state[prefix].adminUsersList;
export const adminUsersCount = (state: ReduxState): number =>
  state[prefix].adminUsersCount;
export const fioAccountsProfilesList = (state: ReduxState): AdminUser[] =>
  state[prefix].fioAccountsProfilesList;
export const fioAccountsProfilesCount = (state: ReduxState): number =>
  state[prefix].fioAccountsProfilesCount;
export const ordersList = (state: ReduxState): OrderDetails[] =>
  state[prefix].ordersList;
export const ordersCount = (state: ReduxState): number =>
  state[prefix].ordersCount;
export const orderItem = (state: ReduxState): OrderDetails =>
  state[prefix].orderItem;
export const adminUserProfile = (state: ReduxState): AdminUserProfile =>
  state[prefix].adminUserProfile;
export const adminSearch = (state: ReduxState): AdminUserProfile =>
  state[prefix].adminSearch;
export const partnersList = (state: ReduxState): AdminUserProfile =>
  state[prefix].partnersList;
export const regularUsersList = (state: ReduxState): User[] =>
  state[prefix].regularUsersList;
export const fioApiUrlsList = (state: ReduxState): FioApiUrl[] =>
  state[prefix].fioApiUrlsList;
