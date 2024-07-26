import Base from './base';

import { DomainsResponse, SearchPrefixesAndPostfixes } from './responses';

export default class Registration extends Base {
  domainsList({ refCode }: { refCode?: string }): Promise<DomainsResponse> {
    return this.apiClient.get('reg/domains/list', { refCode });
  }
  prefixPostfixList(): Promise<SearchPrefixesAndPostfixes> {
    return this.apiClient.get('reg/domain-prefix-postfix');
  }
}
