import Base from '../Base';
import X from '../Exception';
import UsersInfo from './Info';
import { runService } from '../../tools';
import { User, ReferrerProfile } from '../../models';

export default class ActivateAffiliate extends Base {
  static get validationRules() {
    return {
      data: [
        'required',
        {
          nested_object: {
            fch: 'string',
          },
        },
      ],
    };
  }

  async execute({ data }) {
    const user = await User.findActive(this.context.id);

    if (!user) {
      throw new X({
        code: 'NOT_FOUND',
        fields: {
          id: 'NOT_FOUND',
        },
      });
    }

    if (user.affiliateProfileId) {
      throw new X({
        code: 'FORMAT_ERROR',
        fields: {
          id: 'ALREADY_ACTIVATED',
        },
      });
    }

    let affiliateProfile;
    await ReferrerProfile.sequelize.transaction(async t => {
      affiliateProfile = await ReferrerProfile.create(
        {
          type: ReferrerProfile.TYPE.AFFILIATE,
          code: '',
          label: 'Affiliate',
          tpid: data.fch,
          settings: {
            domains: [],
          },
        },
        { transaction: t },
      );
      affiliateProfile.code = ReferrerProfile.generateCode(affiliateProfile.id);

      await affiliateProfile.save({ transaction: t });
      await user.update({
        affiliateProfileId: affiliateProfile.id,
      });
    });

    return await runService(UsersInfo, { context: this.context, params: {} });
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return ['*'];
  }
}
