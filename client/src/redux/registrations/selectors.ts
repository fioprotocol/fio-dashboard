import { createSelector } from 'reselect';

import { refProfileInfo } from '../refProfile/selectors';
import { prefix } from './actions';

import { ReduxState } from '../init';

export const loading = (state: ReduxState) => state[prefix].loading;
export const prices = (state: ReduxState) => state[prefix].prices;
export const registrationDomains = (state: ReduxState) => state[prefix].domains;
export const roe = (state: ReduxState) => state[prefix].roe;
export const roeSetDate = (state: ReduxState) => state[prefix].roeSetDate;
export const domains = createSelector(
  registrationDomains,
  refProfileInfo,
  (regDomainItems, refProfileInfo) =>
    refProfileInfo != null && refProfileInfo.code
      ? refProfileInfo.settings.domains.map((refDomain: string) => ({
          domain: refDomain,
          free: true,
        }))
      : regDomainItems,
);

export const captchaResult = (state: ReduxState) => state[prefix].captchaResult;
export const captchaResolving = (state: ReduxState) =>
  state[prefix].captchaResolving;
export const registrationResult = (state: ReduxState) =>
  state[prefix].registrationResult;
export const isProcessing = (state: ReduxState) => state[prefix].isProcessing;
export const allowCustomDomains = (state: ReduxState) => {
  const refProfile = refProfileInfo(state);
  if (refProfile != null && refProfile.code) {
    return !!refProfile.settings.allowCustomDomain;
  }
  return true;
};
