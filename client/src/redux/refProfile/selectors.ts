import { prefix } from './actions';
import { ReduxState } from '../../types';

export const loading = (state: ReduxState) => state[prefix].loading;
export const data = (state: ReduxState) => state[prefix].data;
