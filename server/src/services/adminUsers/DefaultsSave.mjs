import Base from '../Base';
import { Domain, Username, SearchTerm } from '../../models';

import { ADMIN_ROLES_IDS } from '../../config/constants.js';

export default class DefaultsSave extends Base {
  static get requiredPermissions() {
    return [ADMIN_ROLES_IDS.ADMIN, ADMIN_ROLES_IDS.SUPER_ADMIN];
  }

  static get validationRules() {
    return {
      data: [
        'required',
        {
          nested_object: {
            availableDomains: {
              list_of_objects: [
                {
                  id: { or: ['string', 'positive_integer'] },
                  name: ['required', 'string'],
                  isPremium: 'boolean',
                  isDashboardDomain: 'boolean',
                  rank: { min_number: 0 },
                },
              ],
            },
            dashboardDomains: {
              list_of_objects: [
                {
                  id: { or: ['string', 'positive_integer'] },
                  name: ['required', 'string'],
                  isPremium: 'boolean',
                  isDashboardDomain: 'boolean',
                  rank: { min_number: 0 },
                  expirationDate: ['string'],
                },
              ],
            },
            usernamesOnCustomDomains: {
              list_of_objects: [
                {
                  id: { or: ['string', 'positive_integer'] },
                  username: ['required', 'string'],
                  rank: { min_number: 0 },
                },
              ],
            },
            searchPrefixes: {
              list_of_objects: [
                {
                  id: { or: ['string', 'positive_integer'] },
                  term: ['required', 'string'],
                  isPrefix: 'boolean',
                  rank: { min_number: 0 },
                },
              ],
            },
            searchPostfixes: {
              list_of_objects: [
                {
                  id: { or: ['string', 'positive_integer'] },
                  term: ['required', 'string'],
                  isPrefix: 'boolean',
                  rank: { min_number: 0 },
                },
              ],
            },
            availableDomainsToDelete: { list_of: 'string' },
            dashboardDomainsToDelete: { list_of: 'string' },
            searchPostfixesToDelete: { list_of: 'string' },
            searchPrefixesToDelete: { list_of: 'string' },
            usernamesOnCustomDomainsToDelete: { list_of: 'string' },
          },
        },
      ],
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
      const { id, name, rank, isPremium, expirationDate, isDashboardDomain } = domain;
      if (id) {
        await Domain.update({ name, rank, isPremium, expirationDate }, { where: { id } });
      } else {
        await Domain.create({
          name,
          rank,
          isPremium,
          expirationDate,
          isDashboardDomain,
        });
      }
    }

    for (const searchTerm of [...searchPrefixes, ...searchPostfixes]) {
      const { id, term, rank, isPrefix } = searchTerm;
      if (id) {
        await SearchTerm.update({ term, rank }, { where: { id } });
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
