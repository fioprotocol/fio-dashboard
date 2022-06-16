import { prefix } from './actions';
import { ReduxState } from '../init';

import { AdminUser } from '../../types';

export const loading = (state: ReduxState): boolean => state[prefix].loading;
export const adminUsersList = (state: ReduxState): AdminUser[] =>
  state[prefix].adminUsersList;
