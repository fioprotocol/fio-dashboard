import { LocationState } from 'history';

import { prefix } from './actions';

import { ReduxState } from '../init';
import { RedirectLinkData } from '../../types';

export const pathname = (state: ReduxState): string =>
  state.router.location.pathname;
export const redirectLink = (state: ReduxState): RedirectLinkData =>
  state[prefix].redirectLink;
export const locationState = (state: ReduxState): LocationState =>
  state.router.location.state;
