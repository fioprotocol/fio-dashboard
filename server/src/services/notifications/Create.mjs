import Base from '../Base';

import { Notification } from '../../models';

export default class NotificationsCreate extends Base {
  static get validationRules() {
    return {
      data: [
        'required',
        {
          nested_object: {
            type: 'string',
            action: 'string',
            title: 'string',
            message: 'string',
          },
        },
      ],
    };
  }

  async execute({ data: { type, action, title, message } }) {
    if (action && action === Notification.ACTION.RECOVERY) {
      title = title || 'Password Recovery';
      message =
        message ||
        'You have skipped setting up password recovery, Please make sure to complete this so you do not loose access';
    }
    const existing = await Notification.getItem({
      type,
      action,
      title,
      message,
      userId: this.context.id,
      closeDate: null,
    });
    if (existing && existing.id) return { data: null };
    const notification = new Notification({
      type,
      action,
      title,
      message,
      userId: this.context.id,
    });

    await notification.save();

    return {
      data: Notification.format(notification.get({ plain: true })),
    };
  }

  static get paramsSecret() {
    return ['data.type', 'data.title', 'data.message'];
  }

  static get resultSecret() {
    return ['data.title', 'data.message'];
  }
}
