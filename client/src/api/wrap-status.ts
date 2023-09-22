import Base from './base';

import { WrapStatusListItemsResponse } from './responses';

type WrapParams = {
  limit?: number | null;
  offset?: number | null;
  filters?: {
    createdAt: string;
    dateRange: { startDate: number; endDate: number };
  };
};

export default class WrapStatus extends Base {
  wrapTokensList(params: WrapParams): Promise<WrapStatusListItemsResponse> {
    return this.apiClient.get('wrap-status/tokens/wrap', params);
  }
  unwrapTokensList(params: WrapParams): Promise<WrapStatusListItemsResponse> {
    return this.apiClient.get('wrap-status/tokens/unwrap', params);
  }
  wrapDomainsList(params: WrapParams): Promise<WrapStatusListItemsResponse> {
    return this.apiClient.get('wrap-status/domains/wrap', params);
  }
  unwrapDomainsList(params: WrapParams): Promise<WrapStatusListItemsResponse> {
    return this.apiClient.get('wrap-status/domains/unwrap', params);
  }
}
