import Base from '../Base';
import X from '../Exception';

import { ReferrerProfile } from '../../models';

import { handleExpiredDomains } from '../../utils/fio.mjs';

export default class RefProfileInfo extends Base {
  static get validationRules() {
    return {
      code: ['trim', 'to_lc'],
    };
  }
  async execute({ code }) {
    if (code) {
      const refProfile = await ReferrerProfile.getItem({ code });

      if (!refProfile) {
        throw new X({
          code: 'NOT_FOUND',
          fields: {
            code: 'NOT_FOUND',
          },
        });
      }

      const refProfileFormated = ReferrerProfile.format(refProfile.get({ plain: true }));

      if (refProfileFormated.settings && refProfileFormated.settings.domains) {
        const handledExpiredDomains = await handleExpiredDomains({
          domainsList: refProfileFormated.settings.domains,
        });

        refProfileFormated.settings.domains = handledExpiredDomains;
      }

      return {
        data: refProfileFormated,
      };
    } else {
      return { data: null };
    }
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return ['data.email', 'data.location'];
  }
}
