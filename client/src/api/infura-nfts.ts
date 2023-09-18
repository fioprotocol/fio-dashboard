import Base from './base';

import { InfuraNftsResponse, InfuraNftsMetadataResponse } from './responses';

export default class InfuraNfts extends Base {
  getAllNfts(address: string, chainName?: string): Promise<InfuraNftsResponse> {
    return this.apiClient.get(`fio-nfts`, { address, chainName });
  }
  getNftMetadata({
    chainId,
    tokenAddress,
    tokenId,
  }: {
    chainId: number;
    tokenAddress: string;
    tokenId: string;
  }): Promise<InfuraNftsMetadataResponse> {
    return this.apiClient.get('infura-nfts-metadata', {
      chainId,
      tokenAddress,
      tokenId,
    });
  }
}
