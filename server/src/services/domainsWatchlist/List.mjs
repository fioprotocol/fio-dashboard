import Base from '../Base';

import { DomainsWatchlist } from '../../models';

export default class DomainWatchlistList extends Base {
  async execute() {
    const domainsWatchlistList = await DomainsWatchlist.list({
      userId: this.context.id,
    });

    return {
      data: domainsWatchlistList.map(domainsWatchlistItem =>
        DomainsWatchlist.format(domainsWatchlistItem.get({ plain: true })),
      ),
    };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return ['*'];
  }
}
