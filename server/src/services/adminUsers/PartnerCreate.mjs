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
      type: ['required', 'string'],
      label: ['required', 'string'],
      code: ['required', 'string', 'trim', 'to_lc'],
      tpid: ['string'],
      settings: [
        'required',
        {
          nested_object: {
            domains: {
              list_of_objects: [
                {
                  name: ['required', 'string'],
                  isPremium: 'boolean',
                  rank: { min_number: 0 },
                  isFirstRegFree: 'boolean',
                },
              ],
            },
            gatedRegistration: {
              nested_object: {
                isOn: 'boolean',
                params: {
                  nested_object: {
                    asset: 'string',
                    chainId: 'string',
                    contractAddress: 'string',
                  },
                },
              },
            },
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
      freeFioAccountProfileId: ['string'],
      paidFioAccountProfileId: ['string'],
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
          code: 'This referral code already exists!',
        },
      });
    }

    data.code = data.code.toLowerCase();

    const createdPartner = new ReferrerProfile(data);
    await createdPartner.save();

    return {
      data: { success: true },
    };
  }

  static get paramsSecret() {
    return ['settings.img'];
  }

  static get resultSecret() {
    return [];
  }
}
