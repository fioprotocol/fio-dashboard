import Base from '../Base';
import { ReferrerProfile } from '../../models';
import { ADMIN_ROLES_IDS } from '../../config/constants.js';

export default class PartnersList extends Base {
  static get requiredPermissions() {
    return [ADMIN_ROLES_IDS.ADMIN, ADMIN_ROLES_IDS.SUPER_ADMIN];
  }

  static get validationRules() {
    return {
      offset: 'string',
      limit: 'string',
      filters: [
        {
          nested_object: {
            type: 'string',
          },
        },
      ],
    };
  }

  async execute({ limit = 25, offset = 0, filters }) {
    const where = {};
    if (filters.type) {
      where.type = filters.type;
    }
    const partners = await ReferrerProfile.list(limit, offset, where);
    const partnersCount = await ReferrerProfile.partnersCount(where);

    return {
      data: {
        partners: partners.map(partner => partner.json()),
        maxCount: partnersCount,
      },
    };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return ['data.partners[*].settings.img', 'data.partners[*].apiToken'];
  }
}
