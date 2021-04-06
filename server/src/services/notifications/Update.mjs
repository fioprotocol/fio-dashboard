import Base from '../Base';
import X from '../Exception';

import { Notification } from '../../models';

export default class NotificationsUpdate extends Base {
  static get validationRules() {
    return {
      data: [
        'required',
        {
          nested_object: {
            id: 'integer',
            closeDate: 'string',
          },
        },
      ],
    };
  }

  async execute({ data: { id, closeDate } }) {
    const notification = await Notification.getItem({ id, userId: this.context.id });

    if (!notification) {
      throw new X({
        code: 'NOT_FOUND',
        fields: {
          id: 'NOT_FOUND',
        },
      });
    }

    await notification.update({ closeDate });

    return {
      data: Notification.format(notification.get({ plain: true })),
    };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return [];
  }
}
