import Base from './base';

import { UsersListResponse, UsersShowResponse } from './responses';

export default class Users extends Base {
  list(): Promise<UsersListResponse> {
    return this.apiClient.get('users');
  }

  show(id: string): Promise<UsersShowResponse> {
    return this.apiClient.get(`users/${id}`);
  }
}
