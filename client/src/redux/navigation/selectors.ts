import { prefix } from './actions';
import { ReduxState } from '../init';

export const pathname = (state: ReduxState) => state.router.location.pathname;
export const hasRedirect = (state: ReduxState) => state[prefix].hasRedirect;
