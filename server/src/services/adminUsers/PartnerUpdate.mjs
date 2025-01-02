import Base from '../Base';
import X from '../Exception';

import { ReferrerProfile, ReferrerProfileApiToken } from '../../models';
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
            id: 'string',
            token: ['required', 'string'],
            access: 'boolean',
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

  async execute({ id, ...data }) {
    const partner = await ReferrerProfile.findOne({
      where: { id },
      include: [{ model: ReferrerProfileApiToken, as: 'apiTokens' }],
    });

    if (!partner) {
      throw new X({
        code: 'NOT_FOUND',
        fields: {
          id: 'NOT_FOUND',
          code: 'NOT_FOUND',
        },
      });
    }

    const { apiTokens = [], ...rest } = data;
    for (const apiTokenProfile of apiTokens) {
      if (!checkApiToken(apiTokenProfile.token)) {
        throw new X({
          code: 'UPDATE_FAILED',
          fields: {
            apiToken: 'This api token is incorrect!',
          },
        });
      }
    }

    await partner.update(rest);

    // Remove ref profile api tokens
    if (partner.apiTokens)
      for (const exApiTokenProfile of partner.apiTokens) {
        if (!apiTokens.find(({ id }) => id === exApiTokenProfile.id)) {
          await exApiTokenProfile.destroy();
        }
      }

    // Create / Update ref profile api tokens
    for (const apiTokenProfile of apiTokens) {
      if (apiTokenProfile.id) {
        const { id: tokenProfileId, ...tokenProfileParams } = apiTokenProfile;
        const exApiTokenProfile = partner.apiTokens
          ? partner.apiTokens.find(({ id }) => id === tokenProfileId)
          : null;

        // Reset to send one more time when limit will be reached
        if (
          exApiTokenProfile &&
          exApiTokenProfile.dailyFreeLimit !== tokenProfileParams.dailyFreeLimit
        ) {
          tokenProfileParams.lastNotificationDate = null;
        }

        await ReferrerProfileApiToken.update(tokenProfileParams, {
          where: { id: tokenProfileId },
        });
      } else {
        const newApiTokenProfile = new ReferrerProfileApiToken({
          ...apiTokenProfile,
          refProfileId: partner.id,
        });
        await newApiTokenProfile.save();
      }
    }

    const partnerJson = partner.json();
    return {
      data: {
        ...partnerJson,
        apiTokens: partnerJson.apiTokens.map(apiToken =>
          ReferrerProfileApiToken.format(apiToken),
        ),
      },
    };
  }

  static get paramsSecret() {
    return ['settings.img'];
  }

  static get resultSecret() {
    return ['data.settings.img', 'data.apiToken'];
  }
}
