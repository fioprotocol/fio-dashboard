import Base from './base';

import { DomainsResponse } from './responses';

export default class Registration extends Base {
  domainsList(): Promise<DomainsResponse> {
    return this.apiClient.get('reg/domains/list');
  }
}
