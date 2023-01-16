import Base from './base';

import { DefaultsAvailableDomainsResponse } from './responses';

export default class Defaults extends Base {
  getAvailableDomains(): Promise<DefaultsAvailableDomainsResponse> {
    return this.apiClient.get('defaults/available-domains');
  }
}
