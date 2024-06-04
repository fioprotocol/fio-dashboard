import { prefix } from './actions';

import { ReduxState } from '../../redux/init';
import { RefProfile } from '../../types';

export const loading = (state: ReduxState): boolean => state[prefix].loading;
export const refProfileInfo = (state: ReduxState): RefProfile | null =>
  state[prefix]?.data;
export const refLinkError = (state: ReduxState): string | null =>
  state[prefix].refLinkError;
