import Base from './base';

import {
  DefaultSuccessResponse,
  DefaultNotFoundResponse,
  DomainsWatchlistListResponse,
} from './responses';

import { DEFAULT_ITEMS_LIMIT } from '../constants/common';

export default class DomainsWatchlist extends Base {
  create(domain: string): Promise<DefaultSuccessResponse> {
    return this.apiClient.post('domains-watchlist', { domain });
  }
  delete(
    id: string,
  ): Promise<DefaultSuccessResponse | DefaultNotFoundResponse> {
    return this.apiClient.delete('domains-watchlist', { id });
  }
  list({
    limit = DEFAULT_ITEMS_LIMIT,
    offset = 0,
  }: {
    limit: number;
    offset: number;
  }): Promise<DomainsWatchlistListResponse> {
    return this.apiClient.get('domains-watchlist', { limit, offset });
  }
}
