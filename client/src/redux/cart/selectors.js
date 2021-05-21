import { prefix } from './actions';

export const cart = state => state[prefix] || [];
