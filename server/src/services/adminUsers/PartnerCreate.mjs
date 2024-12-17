import Base from '../Base';
import X from '../Exception';

import { ReferrerProfile, ReferrerProfileApiToken } from '../../models';
import { ADMIN_ROLES_IDS } from '../../config/constants.js';
import { checkApiToken } from '../../utils/crypto.mjs';

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
                  expirationDate: ['string'],
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
            isBranded: 'boolean',
            hasNoProfileFlow: 'boolean',
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
      apiAccess: 'boolean',
      apiTokens: {
        list_of_objects: [
          {
            token: ['required', 'string'],
            access: 'boolean',
            legacyHash: 'string',
            dailyFreeLimit: 'integer',
          },
        ],
      },
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

    const { apiTokens = [], ...rest } = data;
    for (const apiTokenProfile of apiTokens) {
      if (!checkApiToken(apiTokenProfile.token)) {
        throw new X({
          code: 'CREATION_FAILED',
          fields: {
            apiToken: 'This api token is incorrect!',
          },
        });
      }
    }

    const createdPartner = new ReferrerProfile({
      ...rest,
      code: data.code.toLowerCase(),
    });
    await createdPartner.save();

    for (const apiTokenProfile of apiTokens) {
      const newApiTokenProfile = new ReferrerProfileApiToken({
        ...apiTokenProfile,
        refProfileId: createdPartner.id,
      });
      await newApiTokenProfile.save();
    }

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
