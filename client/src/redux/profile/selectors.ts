import { createSelector } from 'reselect';

import {
  ADMIN_USER_ROLES,
  ADMIN_USER_STATUSES,
  USER_STATUSES,
} from '../../constants/common';
import { prefix } from './actions';

import { ReduxState } from '../init';
import { AdminUser, AnyType, LastAuthData, User } from '../../types';

export const loading = (state: ReduxState): boolean => state[prefix].loading;
export const user = (state: ReduxState): User | null => state[prefix].user;
export const adminUser = (state: ReduxState): AdminUser | null =>
  state[prefix].adminUser;
export const adminUserId = createSelector(adminUser, adminUser =>
  adminUser ? adminUser.id : null,
);
export const adminRole = createSelector(
  adminUser,
  adminUser => adminUser && adminUser.role.id,
);
export const email = (state: ReduxState): string | null =>
  state[prefix].user && state[prefix].user.email;
export const isAdmin = createSelector(
  adminRole,
  adminRole => adminRole === ADMIN_USER_ROLES.ADMIN,
);
export const isSuperAdmin = createSelector(
  adminRole,
  adminRole => adminRole === ADMIN_USER_ROLES.SUPER_ADMIN,
);

export const isAdminUserType = (state: ReduxState): boolean =>
  state[prefix].isAdmin && state[prefix].isSuperAdmin;
export const error = (
  state: ReduxState,
): {
  fields?: { [fieldName: string]: AnyType };
  code?: string;
  message?: string;
} | null => state[prefix].error;
export const successfullyRegistered = (state: ReduxState): boolean =>
  state[prefix].successfullyRegistered;
export const lastAuthData = (state: ReduxState): LastAuthData =>
  state[prefix].lastAuthData;
export const tokenCheckResult = (state: ReduxState): boolean | null =>
  state[prefix].tokenCheckResult;
export const lastActivityDate = (state: ReduxState): number =>
  state[prefix].lastActivityDate;
export const profileRefreshed = (state: ReduxState): boolean =>
  state[prefix].profileRefreshed;
export const adminProfileRefreshed = (state: ReduxState): boolean =>
  state[prefix].adminProfileRefreshed;
export const changeRecoveryQuestionsResults = (
  state: ReduxState,
): { status?: number } => state[prefix].changeRecoveryQuestionsResults;
export const isNewUser = (state: ReduxState): boolean =>
  state[prefix].isNewUser;

export const isAuthenticated = createSelector(user, user => !!user);
export const isAdminAuthenticated = createSelector(
  adminUser,
  adminUser => !!adminUser,
);
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

export const isNotActiveAdminUser = createSelector(
  isAdminAuthenticated,
  adminUser,
  adminProfileRefreshed,
  (isAdminAuthenticated, adminUser, adminProfileRefreshed) =>
    adminProfileRefreshed &&
    isAdminAuthenticated &&
    adminUser.status.id !== ADMIN_USER_STATUSES.ACTIVE,
);

export const hasFreeAddress = createSelector(
  user,
  user => user && !!user.freeAddresses.length,
);
export const usersFreeAddresses = createSelector(
  user,
  user => user && user.freeAddresses,
);
export const edgeUsername = createSelector(user, user => user && user.username);
export const isAffiliateEnabled = createSelector(
  user,
  user => !!user?.affiliateProfile?.tpid,
);
