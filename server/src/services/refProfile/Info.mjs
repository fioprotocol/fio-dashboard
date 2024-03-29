import Base from '../Base';
import X from '../Exception';

import { ReferrerProfile } from '../../models';

import { isDomainExpired } from '../../utils/fio.mjs';

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
        const refProfileDomains = refProfileFormated.settings.domains;

        for (const refProfileDomainItem of refProfileDomains) {
          if (!refProfileDomainItem.expirationDate) {
            refProfileDomainItem.isExpired = true;
            continue;
          }

          const isExpired = isDomainExpired(
            refProfileDomainItem.name,
            refProfileDomainItem.expirationDate,
          );

          refProfileDomainItem.isExpired = isExpired;
        }
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
