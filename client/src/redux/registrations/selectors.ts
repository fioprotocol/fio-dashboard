import { createSelector } from 'reselect';

import { refProfileInfo } from '../refProfile/selectors';
import { fioDomains } from '../fio/selectors';

import { prefix } from './actions';

import { ReduxState } from '../init';
import { Domain, FioDomainDoublet, Prices } from '../../types';
import {
  FioRegCaptchaResponse,
  FioRegRegisterResponse,
} from '../../api/responses';

export const loading = (state: ReduxState): boolean => state[prefix].loading;
export const prices = (state: ReduxState): Prices => state[prefix].prices;
export const registrationDomains = (state: ReduxState): Domain[] =>
  state[prefix].domains;
export const roe = (state: ReduxState): number | null => state[prefix].roe;
export const roeSetDate = (state: ReduxState): Date => state[prefix].roeSetDate;
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
export const allDomains = createSelector(
  domains,
  fioDomains,
  (publicDomains, userDomains) => [
    ...publicDomains,
    ...userDomains.map(({ name }: FioDomainDoublet) => ({ domain: name })),
  ],
);

export const captchaResult = (state: ReduxState): FioRegCaptchaResponse =>
  state[prefix].captchaResult;
export const captchaResolving = (state: ReduxState): boolean =>
  state[prefix].captchaResolving;
export const registrationResult = (state: ReduxState): FioRegRegisterResponse =>
  state[prefix].registrationResult;
export const isProcessing = (state: ReduxState): boolean =>
  state[prefix].isProcessing;
export const allowCustomDomains = (state: ReduxState): boolean => {
  const refProfile = refProfileInfo(state);
  if (refProfile != null && refProfile.code) {
    return !!refProfile.settings.allowCustomDomain;
  }
  return true;
};
