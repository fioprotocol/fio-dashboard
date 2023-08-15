import Base from '../Base';
import X from '../Exception';

import { User } from '../../models';

export default class UsersUpdateEmailNotificationParams extends Base {
  static get validationRules() {
    return {
      fioDomainExpiration: ['boolean'],
      fioRequest: ['boolean'],
      fioBalanceChange: ['boolean'],
      lowBundles: ['boolean'],
    };
  }

  async execute(data) {
    const user = await User.findById(this.context.id, {
      where: { status: User.STATUS.ACTIVE },
    });

    if (!user) {
      throw new X({
        code: 'NOT_FOUND',
        fields: {
          id: 'NOT_FOUND',
        },
      });
    }

    await user.update({ emailNotificationParams: data });

    return { data: { success: true } };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return [];
  }
}
