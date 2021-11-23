import Base from '../Base';
import X from '../Exception';

import { Action, User } from '../../models';

export default class UsersUpdateEmailRevert extends Base {
  async execute() {
    const user = await User.findById(this.context.id, {
      where: { status: User.STATUS.NEW_EMAIL_NOT_VERIFIED },
    });

    if (!user) {
      throw new X({
        code: 'NOT_FOUND',
        fields: {
          id: 'NOT_FOUND',
        },
      });
    }

    await user.update({ status: User.STATUS.ACTIVE });

    const action = await Action.findOneWhere({
      data: { userId: this.context.id },
      type: Action.TYPE.UPDATE_EMAIL,
    });

    if (action) await action.destroy({ force: true });

    return { data: { success: true } };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return [];
  }
}
