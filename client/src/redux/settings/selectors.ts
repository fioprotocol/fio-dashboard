import { ReduxState } from '../init';

import { prefix } from './actions';

import { SiteSetting } from '../../types/settings';

export const loading = (state: ReduxState): boolean => state[prefix].loading;
export const siteSetings = (state: ReduxState): SiteSetting =>
  state[prefix].siteSettings;
