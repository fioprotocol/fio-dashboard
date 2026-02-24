import Base from '../Base';

import { DomainsWatchlist } from '../../models';
import { DEFAULT_LIMIT } from '../../constants/general.mjs';

export default class DomainWatchlistList extends Base {
  static get validationRules() {
    return {
      offset: ['integer', { min_number: 0 }],
      limit: ['integer', { min_number: 0 }, { max_number: DEFAULT_LIMIT }],
    };
  }
  async execute({ limit = DEFAULT_LIMIT, offset = 0 }) {
    const domainsWatchlistList = await DomainsWatchlist.list({
      userId: this.context.id,
      limit,
      offset,
    });

    const domainsWatchlistCount = await DomainsWatchlist.count({
      where: { userId: this.context.id },
    });

    return {
      data: {
        list: domainsWatchlistList.map(domainsWatchlistItem =>
          DomainsWatchlist.format(domainsWatchlistItem.get({ plain: true })),
        ),
        maxCount: domainsWatchlistCount,
      },
    };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return ['*'];
  }
}
