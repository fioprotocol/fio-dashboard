import { prefix } from './actions';
import { ReduxState } from '../init';

export const loading = (state: ReduxState) => state[prefix].loading;
