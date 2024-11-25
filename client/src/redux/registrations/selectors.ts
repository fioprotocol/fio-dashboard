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
import { DomainsResponse } from '../../api/responses';

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
    if (refProfileInfo != null && refProfileInfo.code) {
      return {
        allRefProfileDomains: regDomainItems.allRefProfileDomains?.filter(
          regDomainItem => !regDomainItem.isExpired,
        ),
        dashboardDomains: regDomainItems.dashboardDomains?.filter(
          dashboardDomainItem => {
            if (dashboardDomainItem.isExpired) return false;

            return refProfileInfo.type === REF_PROFILE_TYPE.REF
              ? true
              : dashboardDomainItem.isPremium;
          },
        ),
        refProfileDomains: refProfileInfo.settings.domains
          ?.filter(refDomain => !refDomain.isExpired)
          .map(refDomain => ({
            name: refDomain.name,
            isPremium: refDomain.isPremium,
            domainType: refDomain.isPremium
              ? DOMAIN_TYPE.PREMIUM
              : DOMAIN_TYPE.ALLOW_FREE,
            rank: refDomain.rank,
            isFirstRegFree: refDomain.isFirstRegFree,
            hasGatedRegistration:
              refProfileInfo.settings.gatedRegistration?.isOn,
          })),
        usernamesOnCustomDomains: regDomainItems.usernamesOnCustomDomains,
        availableDomains: regDomainItems.availableDomains,
      };
    }

    return {
      ...regDomainItems,
      allRefProfileDomains: regDomainItems.allRefProfileDomains?.filter(
        regDomainItem => !regDomainItem.isExpired,
      ),
      dashboardDomains: regDomainItems.dashboardDomains?.filter(
        dashboardDomainItem => !dashboardDomainItem.isExpired,
      ),
    };
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

export const isProcessing = (state: ReduxState): boolean =>
  state[prefix].isProcessing;
export const hasGetPricesError = (state: ReduxState): boolean =>
  state[prefix].hasGetPricesError;
export const apiUrls = (state: ReduxState): string[] => state[prefix].apiUrls;
