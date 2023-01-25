import Base from './base';

import { DomainsResponse, SearchPrefixesAndPostfixes } from './responses';

export default class Registration extends Base {
  domainsList(): Promise<DomainsResponse> {
    return this.apiClient.get('reg/domains/list');
  }
  prefixPostfixList(): Promise<SearchPrefixesAndPostfixes> {
    return this.apiClient.get('reg/domain-prefix-postfix');
  }
}
