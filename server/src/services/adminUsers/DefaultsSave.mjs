import Base from '../Base';
import { Domain, Username, SearchTerm } from '../../models';

import { ADMIN_ROLES_IDS } from '../../config/constants.js';

export default class DefaultsSave extends Base {
  static get requiredPermissions() {
    return [ADMIN_ROLES_IDS.ADMIN, ADMIN_ROLES_IDS.SUPER_ADMIN];
  }

  static get validationRules() {
    return {
      data: ['required'],
    };
  }

  async execute({ data }) {
    // TODO: refactor to reduce number of db queries
    const {
      availableDomains = [],
      dashboardDomains = [],
      usernamesOnCustomDomains = [],
      searchPrefixes = [],
      searchPostfixes = [],

      availableDomainsToDelete = [],
      dashboardDomainsToDelete = [],
      searchPostfixesToDelete = [],
      searchPrefixesToDelete = [],
      usernamesOnCustomDomainsToDelete = [],
    } = data;

    await Domain.destroy({
      where: { id: [...availableDomainsToDelete, ...dashboardDomainsToDelete] },
    });
    await SearchTerm.destroy({
      where: { id: [...searchPostfixesToDelete, ...searchPrefixesToDelete] },
    });
    await Username.destroy({
      where: { id: [...usernamesOnCustomDomainsToDelete] },
    });

    for (const domain of [...availableDomains, ...dashboardDomains]) {
      const { id, name, rank, isPremium, isDashboardDomain } = domain;
      if (id) {
        await Domain.update(
          { name, rank, isPremium, isDashboardDomain },
          { where: { id } },
        );
      } else {
        await Domain.create({ name, rank, isPremium, isDashboardDomain });
      }
    }

    for (const searchTerm of [...searchPrefixes, ...searchPostfixes]) {
      const { id, term, rank, isPrefix } = searchTerm;
      if (id) {
        await SearchTerm.update({ term, rank, isPrefix }, { where: { id } });
      } else {
        await SearchTerm.create({ term, rank, isPrefix });
      }
    }

    for (const uname of usernamesOnCustomDomains) {
      const { id, username, rank } = uname;
      if (id) {
        await Username.update({ username, rank }, { where: { id } });
      } else {
        await Username.create({ username, rank });
      }
    }

    return {
      data: { success: true },
    };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return [];
  }
}
