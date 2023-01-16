import { prefix } from './actions';
import { ReduxState } from '../init';
import { AdminDomain } from '../../api/responses';

export const loading = (state: ReduxState): boolean => state[prefix].loading;
export const availableDomains = (state: ReduxState): AdminDomain[] =>
  state[prefix].availableDomains;
