import Base from '../Base';
import X from '../Exception';

import { DomainsWatchlist, Var } from '../../models';

import { VARS_KEYS } from '../../config/constants';

export default class DomainWatchlistCreate extends Base {
  static get validationRules() {
    return {
      domain: 'string',
    };
  }

  async execute({ domain }) {
    const userId = this.context.id;

    const existing = await DomainsWatchlist.findOne({
      where: {
        userId,
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

    const maxDomains = Number(
      await Var.getValByKey(VARS_KEYS.MAX_DOMAINS_WATCHLIST_PER_USER),
    );
    if (maxDomains) {
      const domainCount = await DomainsWatchlist.count({
        where: { userId },
      });
      if (domainCount >= maxDomains) {
        throw new X({
          code: 'LIMIT_EXCEEDED',
          fields: {
            domain: 'MAX_DOMAINS_WATCHLIST_REACHED',
          },
        });
      }
    }

    const domainWatchlist = new DomainsWatchlist({
      domain,
      userId,
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
