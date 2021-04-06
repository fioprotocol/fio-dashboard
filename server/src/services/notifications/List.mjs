import Base from '../Base';

import { Notification } from '../../models';

export default class NotificationsList extends Base {
  async execute() {
    const notifications = await Notification.list({ userId: this.context.id });

    return {
      data: notifications.map(notification =>
        Notification.format(notification.get({ plain: true })),
      ),
    };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return [];
  }
}
