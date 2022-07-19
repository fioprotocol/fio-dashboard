import { prefix } from './actions';

import { ReduxState } from '../init';
import { Order } from '../../types';

export const order = (state: ReduxState): Order => state[prefix].order;
