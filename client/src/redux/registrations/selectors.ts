import { createSelector } from 'reselect';

import { refProfileInfo } from '../refProfile/selectors';
import { fioDomains } from '../fio/selectors';

import { prefix } from './actions';

import { REF_PROFILE_TYPE } from '../../constants/common';
import { DOMAIN_TYPE } from '../../constants/fio';

import { ReduxState } from '../init';
import {
  AllDomains,
  FioDomainDoublet,
  Prices,
  PubilcDomainsType,
} from '../../types';
import { DomainsResponse, FioRegCaptchaResponse } from '../../api/responses';

export const loading = (state: ReduxState): boolean =>
  state[prefix].loadingArray.length > 0;
export const prices = (state: ReduxState): Prices => state[prefix].prices;
export const registrationDomains = (state: ReduxState): DomainsResponse =>
  state[prefix].domains;
export const roe = (state: ReduxState): number | null => state[prefix].roe;
export const roeSetDate = (state: ReduxState): Date => state[prefix].roeSetDate;
export const domains = createSelector(
  registrationDomains,
  refProfileInfo,
  (regDomainItems, refProfileInfo): PubilcDomainsType => {
    if (
      refProfileInfo != null &&
      refProfileInfo.code &&
      refProfileInfo.type === REF_PROFILE_TYPE.REF
    ) {
      return {
        refProfileDomains: refProfileInfo.settings.domains.map(refDomain => ({
          name: refDomain.name,
          isPremium: refDomain.isPremium,
          domainType: refDomain.isPremium
            ? DOMAIN_TYPE.PREMIUM
            : DOMAIN_TYPE.ALLOW_FREE,
          allowFree: !refDomain.isPremium,
          rank: refDomain.rank,
        })),
        usernamesOnCustomDomains: regDomainItems.usernamesOnCustomDomains,
        availableDomains: regDomainItems.availableDomains,
      };
    }

    return regDomainItems;
  },
);
export const allDomains = createSelector(
  domains,
  fioDomains,
  (publicDomains, userDomains): AllDomains => ({
    ...publicDomains,
    userDomains: userDomains.map(({ name }: FioDomainDoublet) => ({
      name,
      domainType: DOMAIN_TYPE.USERS,
    })),
  }),
);

export const captchaResult = (state: ReduxState): FioRegCaptchaResponse =>
  state[prefix].captchaResult;
export const captchaResolving = (state: ReduxState): boolean =>
  state[prefix].captchaResolving;
export const isProcessing = (state: ReduxState): boolean =>
  state[prefix].isProcessing;
export const hasGetPricesError = (state: ReduxState): boolean =>
  state[prefix].hasGetPricesError;
export const apiUrls = (state: ReduxState): string[] => state[prefix].apiUrls;
