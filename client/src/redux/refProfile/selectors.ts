import { createSelector } from 'reselect';
import { prefix } from './actions';
import { ReduxState } from '../../redux/init';
import { ROUTES } from '../../constants/routes';

export const loading = (state: ReduxState) => state[prefix].loading;
export const refProfileInfo = (state: ReduxState) => state[prefix].data;
export const refProfileQueryParams = (state: ReduxState) =>
  state[prefix].params;
export const refLinkError = (state: ReduxState) => state[prefix].refLinkError;
export const refStep = (state: ReduxState) => state[prefix].step;
export const homePageLink = createSelector(refProfileInfo, refProfileInfo =>
  refProfileInfo != null && !!refProfileInfo.code
    ? `${ROUTES.REF_PROFILE_HOME}`.replace(
        ':refProfileCode',
        refProfileInfo.code,
      )
    : ROUTES.HOME,
);
export const isRefFlow = createSelector(
  refProfileInfo,
  refProfileInfo => refProfileInfo != null && !!refProfileInfo.code,
);
