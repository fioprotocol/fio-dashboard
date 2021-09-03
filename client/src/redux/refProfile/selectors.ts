import { prefix } from './actions';
import { ReduxState } from '../../types';

export const loading = (state: ReduxState) => state[prefix].loading;
export const refProfileInfo = (state: ReduxState) => state[prefix].data;
export const params = (state: ReduxState) => state[prefix].params;
export const refLinkError = (state: ReduxState) => state[prefix].refLinkError;
