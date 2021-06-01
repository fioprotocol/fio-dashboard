import { prefix } from './actions';
import { createSelector } from 'reselect';

export const loading = state => state[prefix].loading;
export const account = state => state[prefix].account;
export const username = state => state[prefix].username;
export const edgeContextSet = state => state[prefix].edgeContextSet;
export const cachedUsers = state => state[prefix].cachedUsers;
export const loginSuccess = state => state[prefix].loginSuccess;
export const loginFailure = state => state[prefix].loginFailure;
export const recoveryQuestions = state => state[prefix].recoveryQuestions;
export const fioWallets = state => state[prefix].fioWallets;
export const pinConfirmation = state => state[prefix].pinConfirmation;
export const confirmingPin = state => state[prefix].confirmingPin;
export const usernameIsAvailable = state => state[prefix].usernameIsAvailable;
export const usernameAvailableLoading = state =>
  state[prefix].usernameAvailableLoading;

export const isAuthenticated = createSelector(account, account => !!account);
