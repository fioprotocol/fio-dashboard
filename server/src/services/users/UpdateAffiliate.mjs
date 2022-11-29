import Base from '../Base';
import X from '../Exception';
import UsersInfo from './Info';
import { runService } from '../../tools';
import { User, ReferrerProfile } from '../../models';

export default class UpdateAffiliate extends Base {
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

    if (!user || !user.affiliateProfileId) {
      throw new X({
        code: 'NOT_FOUND',
        fields: {
          id: 'NOT_FOUND',
        },
      });
    }

    await ReferrerProfile.update(
      {
        tpid: data.fch,
      },
      {
        where: {
          id: user.affiliateProfileId,
        },
      },
    );

    return await runService(UsersInfo, { context: this.context, params: {} });
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return ['*'];
  }
}
