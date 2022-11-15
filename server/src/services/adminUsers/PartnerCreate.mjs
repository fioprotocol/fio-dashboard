import Base from '../Base';
import X from '../Exception';

import { ReferrerProfile } from '../../models';
import { ADMIN_ROLES_IDS } from '../../config/constants.js';

export default class PartnerCreate extends Base {
  static get requiredPermissions() {
    return [ADMIN_ROLES_IDS.ADMIN, ADMIN_ROLES_IDS.SUPER_ADMIN];
  }

  static get validationRules() {
    return {
      label: ['required', 'string'],
      code: ['required', 'string'],
      regRefApiToken: ['string'],
      tpid: ['string'],
      settings: [
        'required',
        {
          nested_object: {
            domains: { list_of: 'string' },
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

  async execute(data) {
    const existPartner = await ReferrerProfile.findOne({
      where: {
        code: data.code,
      },
    });

    if (existPartner && existPartner.id) {
      throw new X({
        code: 'CREATION_FAILED',
        fields: {
          name: 'PARTNER_ALREADY_EXIST',
          actor: 'PARTNER_ALREADY_EXIST',
          permission: 'PARTNER_ALREADY_EXIST',
        },
      });
    }

    data.regRefCode = data.code;

    const createdPartner = new ReferrerProfile(data);
    await createdPartner.save();

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
