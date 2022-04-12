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
            contentType: 'string',
            title: 'string',
            message: 'string',
            pagesToShow: { list_of: 'string' },
          },
        },
      ],
    };
  }

  async execute({
    data: { type, action, title = null, message = null, pagesToShow = null, contentType },
  }) {
    const existing = await Notification.getItem({
      type,
      action,
      contentType,
      title,
      message,
      userId: this.context.id,
      closeDate: null,
    });
    if (existing && existing.id) return { data: null };
    const notification = new Notification({
      type,
      action,
      contentType,
      title,
      message,
      userId: this.context.id,
      data: { pagesToShow },
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
