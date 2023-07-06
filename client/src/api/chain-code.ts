import Base from './base';

import { ChainCodesListResults } from './responses';

export default class ChainCode extends Base {
  list(chainCode: string): Promise<ChainCodesListResults> {
    return this.apiClient.get(`chain-codes/${chainCode}`);
  }
  selectedList(chainCodes: string[]): Promise<ChainCodesListResults> {
    return this.apiClient.get('selected-chain-codes', { chainCodes });
  }
}
