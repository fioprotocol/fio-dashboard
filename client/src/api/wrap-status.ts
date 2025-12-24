import Base from './base';

import { WrapStatusListItemsResponse } from './responses';

type WrapParams = {
  limit?: number | null;
  offset?: number | null;
  chain?: string;
  filters?: {
    createdAt?: string;
    dateRange?: { startDate: number; endDate: number };
  };
  action: string;
  assetType: string;
};

export default class WrapStatus extends Base {
  getWrapStatusPageData(
    params: WrapParams,
  ): Promise<WrapStatusListItemsResponse> {
    return this.apiClient.get('wrap-status/page/data', params);
  }
}
