import config from '../config';
import ApiClient from './client';

import Auth from './auth';
import Users from './users';
import Edge from './edge';

const apiClient = new ApiClient(config.apiPrefix);

export default {
  auth: new Auth(apiClient),
  users: new Users(apiClient),
  edge: new Edge(),
  client: apiClient,
};
