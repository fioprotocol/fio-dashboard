import { prefix } from './actions';

import { ReduxState } from '../init';
import { Notification } from '../../types';

export const loading = (state: ReduxState): boolean => state[prefix].loading;
export const list = (state: ReduxState): Notification[] => state[prefix].list;
