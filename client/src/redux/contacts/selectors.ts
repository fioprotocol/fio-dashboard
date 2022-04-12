import { prefix } from './actions';
import { ReduxState } from '../init';

export const loading = (state: ReduxState): boolean => state[prefix].loading;
export const list = (state: ReduxState): string[] => state[prefix].list;
