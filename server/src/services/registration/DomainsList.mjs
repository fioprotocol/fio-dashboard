import Base from '../Base';
import { Domain, ReferrerProfile, Username } from '../../models';

import { isDomainExpired } from '../../utils/fio.mjs';

export default class DomainsList extends Base {
  static get validationRules() {
    return {
      refCode: ['string'],
    };
  }

  async execute({ refCode }) {
    const availableDomains = await Domain.getAvailableDomains();
    const dashboardDomains = await Domain.getDashboardDomains();
    const usernamesOnCustomDomains = await Username.findAll({
      order: [['rank', 'DESC']],
    });
    const allRefProfileDomains = await ReferrerProfile.getRefDomainsList();

    for (const dashboardDomainItem of dashboardDomains) {
      if (!dashboardDomainItem.expirationDate) {
        dashboardDomainItem.isExpired = true;
        continue;
      }

      const isExpired = isDomainExpired(
        dashboardDomainItem.name,
        dashboardDomainItem.expirationDate,
      );

      dashboardDomainItem.isExpired = isExpired;
    }

    for (const refProfileDomain of allRefProfileDomains) {
      if (!refProfileDomain.expirationDate) {
        refProfileDomain.isExpired = true;
        continue;
      }

      const isExpired = isDomainExpired(
        refProfileDomain.name,
        refProfileDomain.expirationDate,
      );

      refProfileDomain.isExpired = isExpired;
    }

    const allRefProfileDomainsHandledGatedDomains = dashboardDomains.filter(
      refProfileDomain => {
        const dashboardDomainList = allRefProfileDomains.map(
          dashboardDomain => dashboardDomain.name,
        );

        const refDomainExistsInDashboardDomain = dashboardDomainList.includes(
          refProfileDomain.name,
        );

        const isRefCodeEqualRefprofile = refCode && refCode === refProfileDomain.code;

        return !(
          refDomainExistsInDashboardDomain &&
          refProfileDomain.hasGatedRegistration &&
          !isRefCodeEqualRefprofile
        );
      },
    );

    const dashboardDomainsHandledGatedDomains = dashboardDomains.filter(
      dashboardDomain => {
        const dashboardDomainExistsInRefProfile = allRefProfileDomains.find(
          allRefProfileDomain => allRefProfileDomain.name === dashboardDomain.name,
        );

        const isRefCodeEqualRefprofile =
          refCode &&
          dashboardDomainExistsInRefProfile &&
          refCode === dashboardDomainExistsInRefProfile.code;

        return !(
          dashboardDomainExistsInRefProfile &&
          dashboardDomainExistsInRefProfile.hasGatedRegistration &&
          isRefCodeEqualRefprofile
        );
      },
    );

    return {
      data: {
        availableDomains,
        dashboardDomains: dashboardDomainsHandledGatedDomains,
        allRefProfileDomains: allRefProfileDomainsHandledGatedDomains.map(
          refProfileDomain => {
            delete refProfileDomain.code;
            return refProfileDomain;
          },
        ),
        usernamesOnCustomDomains,
      },
    };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return [];
  }
}
