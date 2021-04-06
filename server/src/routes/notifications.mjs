import { makeServiceRunner } from '../tools';

import NotificationsCreate from '../services/notifications/Create';
import NotificationsUpdate from '../services/notifications/Update';
import NotificationsList from '../services/notifications/List';

export default {
  create: makeServiceRunner(NotificationsCreate, req => req.body),
  update: makeServiceRunner(NotificationsUpdate, req => req.body),
  list: makeServiceRunner(NotificationsList),
};
