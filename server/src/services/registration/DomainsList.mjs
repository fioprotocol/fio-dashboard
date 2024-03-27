import Base from '../Base';
import { Domain, ReferrerProfile, Username } from '../../models';

const REF_COOKIE_NAME = process.env.REACT_APP_REFERRAL_PROFILE_COOKIE_NAME || 'ref';

export default class DomainsList extends Base {
  static get validationRules() {
    return {
      cookies: ['any_object'],
    };
  }

  async execute({ cookies }) {
    const refCookie = cookies && cookies[REF_COOKIE_NAME];

    const availableDomains = await Domain.getAvailableDomains();
    const dashboardDomains = await Domain.getDashboardDomains();
    const usernamesOnCustomDomains = await Username.findAll({
      order: [['rank', 'DESC']],
    });

    const allRefProfileDomains = await ReferrerProfile.getRefDomainsList();

    const allRefProfileDomainsHandledGatedDomains = allRefProfileDomains.filter(
      refProfileDomain => {
        const dashboardDomainList = dashboardDomains.map(
          dashboardDomain => dashboardDomain.name,
        );

        const refDomainExistsInDashboardDomain = dashboardDomainList.includes(
          refProfileDomain.name,
        );

        const isRefCookieEqualRefprofile =
          refCookie && refCookie === refProfileDomain.code;

        return !(
          refDomainExistsInDashboardDomain &&
          refProfileDomain.hasGatedRegistration &&
          !isRefCookieEqualRefprofile
        );
      },
    );

    const dashboardDomainsHandledGatedDomains = dashboardDomains.filter(
      dashboardDomain => {
        const dashboardDomainExistsInRefProfile = allRefProfileDomains.find(
          allRefProfileDomain => allRefProfileDomain.name === dashboardDomain.name,
        );

        const isRefCookieEqualRefprofile =
          refCookie &&
          dashboardDomainExistsInRefProfile &&
          refCookie === dashboardDomainExistsInRefProfile.code;

        return !(
          dashboardDomainExistsInRefProfile &&
          dashboardDomainExistsInRefProfile.hasGatedRegistration &&
          isRefCookieEqualRefprofile
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
