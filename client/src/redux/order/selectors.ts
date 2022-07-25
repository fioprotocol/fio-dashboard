import { prefix } from './actions';

import { ReduxState } from '../init';
import { ApiError, Order } from '../../types';

export const order = (state: ReduxState): Order => state[prefix].order;
export const error = (state: ReduxState): ApiError => state[prefix].error;
