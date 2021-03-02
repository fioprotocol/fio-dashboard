import config from '../config';
import ApiClient from './client';

import Auth from './auth';
import Users from './users';

const apiClient = new ApiClient(config.apiPrefix);

export default {
  auth: new Auth(apiClient),
  users: new Users(apiClient),
  client: apiClient,
};
