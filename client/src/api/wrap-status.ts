import Base from './base';

import { WrapStatusListItemsResponse } from './responses';

export default class WrapStatus extends Base {
  wrapTokensList(
    limit: number,
    offset: number,
  ): Promise<WrapStatusListItemsResponse> {
    return this.apiClient.get('wrap-status/tokens/wrap', { limit, offset });
  }
  unwrapTokensList(
    limit: number,
    offset: number,
  ): Promise<WrapStatusListItemsResponse> {
    return this.apiClient.get('wrap-status/tokens/unwrap', { limit, offset });
  }
  wrapDomainsList(
    limit: number,
    offset: number,
  ): Promise<WrapStatusListItemsResponse> {
    return this.apiClient.get('wrap-status/domains/wrap', { limit, offset });
  }
  unwrapDomainsList(
    limit: number,
    offset: number,
  ): Promise<WrapStatusListItemsResponse> {
    return this.apiClient.get('wrap-status/domains/unwrap', { limit, offset });
  }
}
