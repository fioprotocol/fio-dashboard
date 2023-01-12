import Base from '../Base';
import { Domain, Username, SearchTerm } from '../../models';
import { ADMIN_ROLES_IDS } from '../../config/constants.js';

export default class DefaultList extends Base {
  static get requiredPermissions() {
    return [ADMIN_ROLES_IDS.ADMIN, ADMIN_ROLES_IDS.SUPER_ADMIN];
  }

  async execute() {
    const availableDomains = await Domain.getAvailableDomains();
    const dashboardDomains = await Domain.getDashboardDomains();
    const usernamesOnCustomDomains = await Username.findAll({
      order: [['rank', 'DESC']],
    });
    const searchPrefixes = await SearchTerm.getPrefixes();
    const searchPostfixes = await SearchTerm.getPostfixes();

    return {
      data: {
        availableDomains,
        dashboardDomains,
        usernamesOnCustomDomains,
        searchPrefixes,
        searchPostfixes,
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
