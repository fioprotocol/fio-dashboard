import { prefix } from './actions';
import { createSelector } from 'reselect';

export const loading = state => state[prefix].loading;
export const account = state => state[prefix].account;
export const edgeContextSet = state => state[prefix].edgeContextSet;
export const cachedUsers = state => state[prefix].cachedUsers;
export const loginSuccess = state => state[prefix].loginSuccess;

export const isAuthenticated = createSelector(
  account,
  account => !!account,
);
