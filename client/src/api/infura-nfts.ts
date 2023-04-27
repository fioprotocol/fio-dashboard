import Base from './base';

import { InfuraNftsResponse } from './responses';

export default class InfuraNfts extends Base {
  getAllNfts(account: string, chainId?: string): Promise<InfuraNftsResponse> {
    return this.apiClient.get(`infura-nfts`, { account, chainId });
  }
}
