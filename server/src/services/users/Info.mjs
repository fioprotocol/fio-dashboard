import Base from '../Base';
import X from '../Exception';

import { User, Notification } from '../../models';

export default class UsersInfo extends Base {
  async execute() {
    const user = await User.findActive(this.context.id);

    if (!user) {
      throw new X({
        code: 'NOT_FOUND',
        fields: {
          id: 'NOT_FOUND',
        },
      });
    }

    const userObj = user.json();
    userObj.secretSetNotification = false;

    if (!userObj.secretSet) {
      const secretSetNotification = await Notification.getItem({
        action: Notification.ACTION.RECOVERY,
        userId: user.id,
      });
      userObj.secretSetNotification = !!secretSetNotification;
    }

    return {
      data: userObj,
    };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return ['data.email', 'data.location'];
  }
}
