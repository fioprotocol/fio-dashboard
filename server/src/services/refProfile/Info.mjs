import Base from '../Base';
import X from '../Exception';

import { ReferrerProfile } from '../../models';

export default class RefProfileInfo extends Base {
  static get validationRules() {
    return {
      code: ['required', 'trim', 'to_lc'],
    };
  }
  async execute({ code }) {
    if (code != null && code !== 'null') {
      const refProfile = await ReferrerProfile.getItem({ code });

      if (!refProfile) {
        throw new X({
          code: 'NOT_FOUND',
          fields: {
            code: 'NOT_FOUND',
          },
        });
      }

      return {
        data: ReferrerProfile.format(refProfile.get({ plain: true })),
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
