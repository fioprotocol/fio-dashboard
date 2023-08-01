import Base from '../Base';
import X from '../Exception';

import { DomainsWatchlist } from '../../models';

export default class DomainWatchlistCreate extends Base {
  static get validationRules() {
    return {
      domain: 'string',
    };
  }

  async execute({ domain }) {
    const user = this.context.id;

    const existing = await DomainsWatchlist.findOne({
      where: {
        userId: user,
        domain,
      },
    });

    if (existing && existing.id) {
      throw new X({
        code: 'CREATION_FAILED',
        fields: {
          code: 'This domain already exists!',
        },
      });
    }

    const domainWatchlist = new DomainsWatchlist({
      domain,
      userId: user,
    });

    await domainWatchlist.save();

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
