import { createSelector } from 'reselect';
import { prefix } from './actions';

export const loading = state => state[prefix].loading;
export const user = state => state[prefix].user;
export const role = state => state[prefix].user && state[prefix].user.role;
export const email = state => state[prefix].user && state[prefix].user.email;
export const isAdmin = state =>
  state[prefix].user && state[prefix].user.role === 'ADMIN';
export const error = state => state[prefix].error;
export const isConfirmed = state => state[prefix].isConfirmed;
export const isChangedPwd = state => state[prefix].isChangedPwd;
export const isRecoveryRequested = state => state[prefix].isRecoveryRequested;
export const successfullyRegistered = state =>
  state[prefix].successfullyRegistered;
export const lastAuthData = state => state[prefix].lastAuthData;
export const tokenCheckResult = state => state[prefix].tokenCheckResult;
export const lastActivityDate = state => state[prefix].lastActivityDate;

export const isAuthenticated = createSelector(user, user => !!user);
export const profileRefreshed = state => state[prefix].profileRefreshed;
export const noProfileLoaded = createSelector(
  isAuthenticated,
  profileRefreshed,
  (isAuthenticated, profileRefreshed) => !isAuthenticated && profileRefreshed,
);
export const hasFreeAddress = createSelector(
  user,
  user => user && !!user.freeAddresses.length,
);
export const edgeUsername = createSelector(user, user => user && user.username);
export const changeRecoveryQuestionsResults = state =>
  state[prefix].changeRecoveryQuestionsResults;
