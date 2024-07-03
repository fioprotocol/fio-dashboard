import Base from '../Base';
import X from '../Exception';

import { ReferrerProfile } from '../../models';
import { ADMIN_ROLES_IDS } from '../../config/constants.js';
import { checkApiToken } from '../../utils/crypto.mjs';

export default class PartnerUpdate extends Base {
  static get requiredPermissions() {
    return [ADMIN_ROLES_IDS.ADMIN, ADMIN_ROLES_IDS.SUPER_ADMIN];
  }

  static get validationRules() {
    return {
      id: ['required', 'string'],
      type: ['required', 'string'],
      label: ['required', 'string'],
      tpid: ['string'],
      apiToken: ['string'],
      apiAccess: ['boolean'],
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
      title: ['string'],
      subTitle: ['string'],
      freeFioAccountProfileId: ['string'],
      paidFioAccountProfileId: ['string'],
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

    if (data.apiToken && !checkApiToken(data.apiToken)) {
      throw new X({
        code: 'CREATION_FAILED',
        fields: {
          code: 'This api token is incorrect!',
        },
      });
    }

    if (!data.apiToken && data.apiAccess) {
      throw new X({
        code: 'CREATION_FAILED',
        fields: {
          apiToken: 'Api token required for api access!',
        },
      });
    }

    await partner.update({
      ...data,
      apiToken: data.apiToken ? data.apiToken : partner.apiToken,
    });

    return {
      data: partner.json(),
    };
  }

  static get paramsSecret() {
    return ['settings.img'];
  }

  static get resultSecret() {
    return ['data.settings.img', 'data.apiToken'];
  }
}
