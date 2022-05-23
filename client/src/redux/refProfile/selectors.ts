import { createSelector } from 'reselect';

import { prefix } from './actions';
import { ROUTES } from '../../constants/routes';

// import { putParamsToUrl } from '../../utils';

import { ReduxState } from '../../redux/init';
import { RefProfile } from '../../types';

export const loading = (state: ReduxState): boolean => state[prefix].loading;
export const refProfileInfo = (state: ReduxState): RefProfile | null =>
  state[prefix].data;
export const refLinkError = (state: ReduxState): string | null =>
  state[prefix].refLinkError;

export const homePageLink = createSelector(
  refProfileInfo,
  info => ROUTES.HOME,
  // todo: handle redirect on contained flow

  // info != null && info.code != null && info.code !== ''
  //   ? putParamsToUrl(ROUTES.HOME, {
  //       refProfileCode: info.code,
  //     })
  //   : ROUTES.HOME,
);
export const isRefSet = createSelector(
  refProfileInfo,
  info => info != null && info.code != null && info.code !== '',
);
