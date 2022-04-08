import { createSelector } from 'reselect';

import { USER_STATUSES } from '../../constants/common';
import { prefix } from './actions';

import { ReduxState } from '../init';

export const loading = (state: ReduxState) => state[prefix].loading;
export const user = (state: ReduxState) => state[prefix].user;
export const role = (state: ReduxState) =>
  state[prefix].user && state[prefix].user.role;
export const email = (state: ReduxState) =>
  state[prefix].user && state[prefix].user.email;
export const isAdmin = (state: ReduxState) =>
  state[prefix].user && state[prefix].user.role === 'ADMIN';
export const error = (state: ReduxState) => state[prefix].error;
export const emailConfirmationResult = (state: ReduxState) =>
  state[prefix].emailConfirmationResult;
export const successfullyRegistered = (state: ReduxState) =>
  state[prefix].successfullyRegistered;
export const lastAuthData = (state: ReduxState) => state[prefix].lastAuthData;
export const tokenCheckResult = (state: ReduxState) =>
  state[prefix].tokenCheckResult;
export const lastActivityDate = (state: ReduxState) =>
  state[prefix].lastActivityDate;
export const emailConfirmationToken = (state: ReduxState) =>
  state[prefix].emailConfirmationToken;
export const emailConfirmationSent = (state: ReduxState) =>
  state[prefix].emailConfirmationSent;

export const isAuthenticated = createSelector(user, user => !!user);
export const userId = createSelector(user, user => (user ? user.id : null));
export const profileRefreshed = (state: ReduxState) =>
  state[prefix].profileRefreshed;
export const noProfileLoaded = createSelector(
  isAuthenticated,
  profileRefreshed,
  (isAuthenticated, profileRefreshed) => !isAuthenticated && profileRefreshed,
);
export const isActiveUser = createSelector(
  isAuthenticated,
  user,
  profileRefreshed,
  (isAuthenticated, user, profileRefreshed) =>
    profileRefreshed && isAuthenticated && user.status === USER_STATUSES.ACTIVE,
);

export const isNotActiveUser = createSelector(
  isAuthenticated,
  user,
  profileRefreshed,
  (isAuthenticated, user, profileRefreshed) =>
    profileRefreshed && isAuthenticated && user.status !== USER_STATUSES.ACTIVE,
);

export const isNewEmailNotVerified = createSelector(
  isAuthenticated,
  user,
  profileRefreshed,
  (isAuthenticated, user, profileRefreshed) =>
    profileRefreshed &&
    isAuthenticated &&
    user.status === USER_STATUSES.NEW_EMAIL_NOT_VERIFIED,
);

export const isNewUser = createSelector(
  isAuthenticated,
  user,
  profileRefreshed,
  (isAuthenticated, user, profileRefreshed) =>
    profileRefreshed && isAuthenticated && user.status === USER_STATUSES.NEW,
);

export const hasFreeAddress = createSelector(
  user,
  user => user && !!user.freeAddresses.length,
);
export const edgeUsername = createSelector(user, user => user && user.username);
export const changeRecoveryQuestionsResults = (state: ReduxState) =>
  state[prefix].changeRecoveryQuestionsResults;

export const updateEmailLoading = (state: ReduxState) =>
  state[prefix].updateEmailLoading;
