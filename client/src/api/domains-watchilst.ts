import Base from './base';

import {
  DefaultSuccessResponse,
  DefaultNotFoundResponse,
  DomainsWatchlistListResponse,
} from './responses';

export default class DomainsWatchlist extends Base {
  create(domain: string): Promise<DefaultSuccessResponse> {
    return this.apiClient.post('domains-watchlist', { domain });
  }
  delete(
    id: string,
  ): Promise<DefaultSuccessResponse | DefaultNotFoundResponse> {
    return this.apiClient.delete('domains-watchlist', { id });
  }
  list(): Promise<DomainsWatchlistListResponse> {
    return this.apiClient.get('domains-watchlist');
  }
}
