import { prefix } from './actions';

export const pathname = state => state[prefix].location.pathname;
