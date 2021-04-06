import config from '../config';
import ApiClient from './client';

import Auth from './auth';
import Users from './users';
import Edge from './edge';
import Notifications from './notifications';

const apiClient = new ApiClient(config.apiPrefix);

export default {
  auth: new Auth(apiClient),
  users: new Users(apiClient),
  edge: new Edge(),
  notifications: new Notifications(apiClient),
  client: apiClient,
};
