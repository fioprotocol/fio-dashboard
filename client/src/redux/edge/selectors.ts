import { prefix } from './actions';
import { ReduxState } from '../init';

export const loading = (state: ReduxState) => state[prefix].loading;
export const username = (state: ReduxState) => state[prefix].username;
export const edgeContextSet = (state: ReduxState) =>
  state[prefix].edgeContextSet;
export const cachedUsers = (state: ReduxState) => state[prefix].cachedUsers;
export const loginSuccess = (state: ReduxState) => state[prefix].loginSuccess;
export const loginFailure = (state: ReduxState) => state[prefix].loginFailure;
export const recoveryQuestions = (state: ReduxState) =>
  state[prefix].recoveryQuestions;
export const pinConfirmation = (state: ReduxState) =>
  state[prefix].pinConfirmation;
export const confirmingPin = (state: ReduxState) => state[prefix].confirmingPin;
export const usernameIsAvailable = (state: ReduxState) =>
  state[prefix].usernameIsAvailable;
export const usernameAvailableLoading = (state: ReduxState) =>
  state[prefix].usernameAvailableLoading;
export const changePasswordResults = (state: ReduxState) =>
  state[prefix].changePasswordResults;
export const changePasswordError = (state: ReduxState) =>
  state[prefix].changePasswordError;
export const changePinResults = (state: ReduxState) =>
  state[prefix].changePinResults;
export const changePinError = (state: ReduxState) =>
  state[prefix].changePinError;
export const changeRecoveryQuestions = (state: ReduxState) =>
  state[prefix].changeRecoveryQuestions;

export const hasRecoveryQuestions = (state: ReduxState) =>
  state[prefix].hasRecoveryQuestions;
export const questionsLoading = (state: ReduxState) =>
  state[prefix].questionsLoading;
export const usersRecoveryQuestions = (state: ReduxState) =>
  state[prefix].usersRecoveryQuestions;
export const recoveryAccountResults = (state: ReduxState) =>
  state[prefix].recoveryAccountResults;
export const disableRecoveryResults = (state: ReduxState) =>
  state[prefix].disableRecoveryResults;
