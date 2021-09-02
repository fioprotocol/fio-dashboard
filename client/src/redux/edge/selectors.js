import { prefix } from './actions';

export const loading = state => state[prefix].loading;
export const username = state => state[prefix].username;
export const edgeContextSet = state => state[prefix].edgeContextSet;
export const cachedUsers = state => state[prefix].cachedUsers;
export const loginSuccess = state => state[prefix].loginSuccess;
export const loginFailure = state => state[prefix].loginFailure;
export const recoveryQuestions = state => state[prefix].recoveryQuestions;
export const pinConfirmation = state => state[prefix].pinConfirmation;
export const confirmingPin = state => state[prefix].confirmingPin;
export const usernameIsAvailable = state => state[prefix].usernameIsAvailable;
export const usernameAvailableLoading = state =>
  state[prefix].usernameAvailableLoading;
export const changePasswordResults = state =>
  state[prefix].changePasswordResults;
export const changePasswordError = state => state[prefix].changePasswordError;
export const changePinResults = state => state[prefix].changePinResults;
export const changePinError = state => state[prefix].changePinError;
export const changeRecoveryQuestions = state =>
  state[prefix].changeRecoveryQuestions;
