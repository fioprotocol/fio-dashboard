import Sequelize from 'sequelize';

import Base from '../Base';

import { Notification } from '../../models';

const SHOWN_NOTIFICATION_CONTENT_TYPES = [
  Notification.CONTENT_TYPE.ACCOUNT_CONFIRMATION,
  Notification.CONTENT_TYPE.ACCOUNT_CREATE,
  Notification.CONTENT_TYPE.RECOVERY_PASSWORD,
];

export default class NotificationsList extends Base {
  async execute() {
    const notifications = await Notification.list({
      userId: this.context.id,
      contentType: { [Sequelize.Op.in]: SHOWN_NOTIFICATION_CONTENT_TYPES },
    });

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
