import Base from '../Base';
import { ReferrerProfile, ReferrerProfileApiToken } from '../../models';
import { ADMIN_ROLES_IDS } from '../../config/constants.js';
import { DEFAULT_LIMIT, MAX_LIMIT } from '../../constants/general.mjs';

export default class PartnersList extends Base {
  static get requiredPermissions() {
    return [ADMIN_ROLES_IDS.ADMIN, ADMIN_ROLES_IDS.SUPER_ADMIN];
  }

  static get validationRules() {
    return {
      offset: ['integer', { min_number: 0 }],
      limit: ['integer', { min_number: 0 }, { max_number: MAX_LIMIT }],
      filters: [
        {
          nested_object: {
            type: 'string',
          },
        },
      ],
    };
  }

  async execute({ limit = DEFAULT_LIMIT, offset = 0, filters }) {
    const where = {};
    if (filters.type) {
      where.type = filters.type;
    }
    const partners = await ReferrerProfile.list(limit, offset, where);
    const partnersCount = await ReferrerProfile.partnersCount(where);

    return {
      data: {
        partners: partners.map(partner => {
          const pJson = partner.json();

          return {
            ...pJson,
            apiTokens: pJson.apiTokens.map(apiToken =>
              ReferrerProfileApiToken.format(apiToken),
            ),
          };
        }),
        maxCount: partnersCount,
      },
    };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return ['data.partners[*].settings.img'];
  }
}
