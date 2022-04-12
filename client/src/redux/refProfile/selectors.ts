import { createSelector } from 'reselect';

import { prefix } from './actions';
import { ROUTES } from '../../constants/routes';

import { putParamsToUrl } from '../../utils';

import { ReduxState } from '../../redux/init';
import { RefProfile, RefQueryParams } from '../../types';

export const loading = (state: ReduxState): boolean => state[prefix].loading;
export const refProfileInfo = (state: ReduxState): RefProfile | null =>
  state[prefix].data;
export const refProfileQueryParams = (
  state: ReduxState,
): RefQueryParams | null => state[prefix].params;
export const refLinkError = (state: ReduxState): string | null =>
  state[prefix].refLinkError;
export const refStep = (state: ReduxState): string => state[prefix].step;
export const homePageLink = createSelector(refProfileInfo, info =>
  info != null && info.code != null && info.code !== ''
    ? putParamsToUrl(ROUTES.REF_PROFILE_HOME, {
        refProfileCode: info.code,
      })
    : ROUTES.HOME,
);
export const isRefFlow = createSelector(
  refProfileInfo,
  info => info != null && info.code != null && info.code !== '',
);
