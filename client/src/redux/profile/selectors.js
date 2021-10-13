import { createSelector } from 'reselect';
import { USER_STATUSES } from '../../constants/common';
import { prefix } from './actions';

export const loading = state => state[prefix].loading;
export const user = state => state[prefix].user;
export const role = state => state[prefix].user && state[prefix].user.role;
export const email = state => state[prefix].user && state[prefix].user.email;
export const isAdmin = state =>
  state[prefix].user && state[prefix].user.role === 'ADMIN';
export const error = state => state[prefix].error;
export const emailConfirmationResult = state =>
  state[prefix].emailConfirmationResult;
export const successfullyRegistered = state =>
  state[prefix].successfullyRegistered;
export const lastAuthData = state => state[prefix].lastAuthData;
export const tokenCheckResult = state => state[prefix].tokenCheckResult;
export const lastActivityDate = state => state[prefix].lastActivityDate;
export const emailConfirmationToken = state =>
  state[prefix].emailConfirmationToken;
export const emailConfirmationSent = state =>
  state[prefix].emailConfirmationSent;

export const isAuthenticated = createSelector(user, user => !!user);
export const profileRefreshed = state => state[prefix].profileRefreshed;
export const noProfileLoaded = createSelector(
  isAuthenticated,
  profileRefreshed,
  (isAuthenticated, profileRefreshed) => !isAuthenticated && profileRefreshed,
);
export const isActiveUser = createSelector(
  isAuthenticated,
  user,
  (isAuthenticated, user) =>
    isAuthenticated && user.status === USER_STATUSES.ACTIVE,
);
export const hasFreeAddress = createSelector(
  user,
  user => user && !!user.freeAddresses.length,
);
export const edgeUsername = createSelector(user, user => user && user.username);
export const changeRecoveryQuestionsResults = state =>
  state[prefix].changeRecoveryQuestionsResults;

export const resendRecoveryResults = state =>
  state[prefix].resendRecoveryResults;
export const resending = state => state[prefix].resending;
