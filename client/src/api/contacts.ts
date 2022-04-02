import Base from './base';

import { ContactsCreateResponse, ContactsListResponse } from './responses';

export default class Contacts extends Base {
  list(): Promise<ContactsListResponse> {
    return this.apiClient.get('contacts');
  }

  create(data: { name: string }): Promise<ContactsCreateResponse> {
    return this.apiClient.post('contacts', { data });
  }
}
