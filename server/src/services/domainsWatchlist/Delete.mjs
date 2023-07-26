import Base from '../Base';

import { DomainsWatchlist } from '../../models';

export default class DomainWatchlistDelete extends Base {
  static get validationRules() {
    return {
      id: 'string',
    };
  }

  async execute({ id }) {
    const domainWatchlistItem = await DomainsWatchlist.findById(id);

    if (!domainWatchlistItem) return { data: { success: false, message: 'Not Found' } };

    await domainWatchlistItem.destroy({ force: true });

    return { data: { success: true } };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return [];
  }
}
