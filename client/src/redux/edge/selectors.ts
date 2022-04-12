import { prefix } from './actions';
import { ReduxState } from '../init';
import { EdgeWalletsKeys, PinConfirmation, StatusResponse } from '../../types';

export const loading = (state: ReduxState): boolean => state[prefix].loading;
export const edgeContextSet = (state: ReduxState): boolean =>
  state[prefix].edgeContextSet;
export const cachedUsers = (state: ReduxState): string[] =>
  state[prefix].cachedUsers;
export const loginSuccess = (state: ReduxState): boolean =>
  state[prefix].loginSuccess;
export const loginFailure = (state: ReduxState): { type?: string } =>
  state[prefix].loginFailure;
export const recoveryQuestions = (
  state: ReduxState,
): { category: string; question: string }[] => state[prefix].recoveryQuestions;
export const pinConfirmation = (state: ReduxState): PinConfirmation | string =>
  state[prefix].pinConfirmation;
export const confirmPinKeys = (state: ReduxState): EdgeWalletsKeys | null =>
  state[prefix].confirmPinKeys;
export const confirmingPin = (state: ReduxState): boolean =>
  state[prefix].confirmingPin;
export const usernameIsAvailable = (state: ReduxState): boolean =>
  state[prefix].usernameIsAvailable;
export const usernameAvailableLoading = (state: ReduxState): boolean =>
  state[prefix].usernameAvailableLoading;
export const changePasswordResults = (state: ReduxState): StatusResponse =>
  state[prefix].changePasswordResults;
export const changePasswordError = (
  state: ReduxState,
): { type?: string; message?: string; name?: string } =>
  state[prefix].changePasswordError;
export const changePinResults = (state: ReduxState): StatusResponse =>
  state[prefix].changePinResults;
export const changePinError = (state: ReduxState): { type?: string } =>
  state[prefix].changePinError;
export const changeRecoveryQuestions = (state: ReduxState): boolean =>
  state[prefix].changeRecoveryQuestions;

export const hasRecoveryQuestions = (state: ReduxState): boolean =>
  state[prefix].hasRecoveryQuestions;
export const questionsLoading = (state: ReduxState): boolean =>
  state[prefix].questionsLoading;
export const usersRecoveryQuestions = (state: ReduxState): string[] =>
  state[prefix].usersRecoveryQuestions;
export const recoveryAccountResults = (
  state: ReduxState,
): { status?: number; type?: string } => state[prefix].recoveryAccountResults;

export const hasTwoFactorAuth = (state: ReduxState): boolean =>
  state[prefix].hasTwoFactorAuth;
