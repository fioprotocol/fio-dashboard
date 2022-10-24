import { ReduxState } from '../init';

import { prefix } from './actions';

import { UserOrderDetails } from '../../types';

export const loading = (state: ReduxState): boolean => state[prefix].loading;
export const ordersList = (state: ReduxState): UserOrderDetails[] | [] =>
  state[prefix].ordersList;
export const totalOrdersCount = (state: ReduxState): number =>
  state[prefix].totalOrdersCount;
