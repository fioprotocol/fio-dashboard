import Base from '../Base';
import X from '../Exception';

import { ReferrerProfile } from '../../models';
import { ADMIN_ROLES_IDS } from '../../config/constants.js';

export default class PartnerUpdate extends Base {
  static get requiredPermissions() {
    return [ADMIN_ROLES_IDS.ADMIN, ADMIN_ROLES_IDS.SUPER_ADMIN];
  }

  static get validationRules() {
    return {
      id: ['required', 'string'],
      type: ['required', 'string'],
      regRefCode: ['string'],
      label: ['required', 'string'],
      regRefApiToken: ['string'],
      tpid: ['string'],
      settings: [
        'required',
        {
          nested_object: {
            domains: { list_of: 'string' },
            premiumDomains: { list_of: 'string' },
            preselectedDomain: 'string',
            allowCustomDomain: 'boolean',
            img: 'string',
            link: 'string',
            actions: [
              {
                nested_object: {
                  SIGNNFT: [
                    {
                      nested_object: {
                        title: ['string'],
                        subtitle: ['string'],
                        actionText: ['string'],
                        hideActionText: ['boolean'],
                      },
                    },
                  ],
                  REG: [
                    {
                      nested_object: {
                        title: ['string'],
                        subtitle: ['string'],
                        actionText: ['string'],
                        hideActionText: ['boolean'],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
      title: ['string'],
      subTitle: ['string'],
    };
  }

  async execute({ id, ...data }) {
    const partner = await ReferrerProfile.findById(id);

    if (!partner) {
      throw new X({
        code: 'NOT_FOUND',
        fields: {
          id: 'NOT_FOUND',
          code: 'NOT_FOUND',
        },
      });
    }

    await partner.update(data);

    return {
      data: partner.json(),
    };
  }

  static get paramsSecret() {
    return ['settings.img'];
  }

  static get resultSecret() {
    return ['data.settings.img'];
  }
}
