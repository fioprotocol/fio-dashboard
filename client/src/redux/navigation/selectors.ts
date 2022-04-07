import { prefix } from './actions';
import { ReduxState } from '../init';

export const pathname = (state: ReduxState) => state.router.location.pathname;
export const redirectLink = (state: ReduxState) => state[prefix].redirectLink;
export const locationState = (state: ReduxState) => state.router.location.state;
