import Base from '../Base';
import { Domain, ReferrerProfile, Username } from '../../models';

// import { handleExpiredDomains } from '../../utils/fio.mjs';

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

    // todo: move to cron job expiration domain handling

    // const handledExpiredDashboardDomains = await handleExpiredDomains({
    //   domainsList: dashboardDomains,
    // });

    // const handledExpiredAllRefProfileDomains = await handleExpiredDomains({
    //   domainsList: allRefProfileDomains,
    // });

    const handledExpiredDashboardDomains = dashboardDomains;

    const handledExpiredAllRefProfileDomains = allRefProfileDomains;

    const allRefProfileDomainsHandledGatedDomains = handledExpiredAllRefProfileDomains.filter(
      refProfileDomain => {
        const dashboardDomainList = handledExpiredDashboardDomains.map(
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

    const dashboardDomainsHandledGatedDomains = handledExpiredDashboardDomains.filter(
      dashboardDomain => {
        const dashboardDomainExistsInRefProfile = handledExpiredAllRefProfileDomains.find(
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
