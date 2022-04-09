import { createSelector } from 'reselect';

import { USER_STATUSES } from '../../constants/common';
import { prefix } from './actions';

import { ReduxState } from '../init';
import {
  AnyType,
  EmailConfirmationResult,
  LastAuthData,
  User,
} from '../../types';

export const loading = (state: ReduxState): boolean => state[prefix].loading;
export const user = (state: ReduxState): User | null => state[prefix].user;
export const role = (state: ReduxState): string | null =>
  state[prefix].user && state[prefix].user.role;
export const email = (state: ReduxState): string | null =>
  state[prefix].user && state[prefix].user.email;
export const isAdmin = (state: ReduxState): boolean =>
  state[prefix].user && state[prefix].user.role === 'ADMIN';
export const error = (
  state: ReduxState,
): {
  fields?: { [fieldName: string]: AnyType };
  code?: string;
  message?: string;
} | null => state[prefix].error;
export const emailConfirmationResult = (
  state: ReduxState,
): EmailConfirmationResult => state[prefix].emailConfirmationResult;
export const successfullyRegistered = (state: ReduxState): boolean =>
  state[prefix].successfullyRegistered;
export const lastAuthData = (state: ReduxState): LastAuthData =>
  state[prefix].lastAuthData;
export const tokenCheckResult = (state: ReduxState): boolean | null =>
  state[prefix].tokenCheckResult;
export const lastActivityDate = (state: ReduxState): number =>
  state[prefix].lastActivityDate;
export const emailConfirmationToken = (state: ReduxState): string | null =>
  state[prefix].emailConfirmationToken;
export const emailConfirmationSent = (state: ReduxState): boolean =>
  state[prefix].emailConfirmationSent;
export const profileRefreshed = (state: ReduxState): boolean =>
  state[prefix].profileRefreshed;
export const changeRecoveryQuestionsResults = (
  state: ReduxState,
): { status?: number } => state[prefix].changeRecoveryQuestionsResults;
export const updateEmailLoading = (state: ReduxState): boolean =>
  state[prefix].updateEmailLoading;

export const isAuthenticated = createSelector(user, user => !!user);
export const userId = createSelector(user, user => (user ? user.id : null));
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
