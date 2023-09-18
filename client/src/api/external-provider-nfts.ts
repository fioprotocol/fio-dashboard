import Base from './base';

import {
  ExternalProviderNftsResponse,
  ExternalProviderNftsMetadataResponse,
} from './responses';

export default class ExternalProviderNfts extends Base {
  getAllNfts(
    address: string,
    chainName?: string,
  ): Promise<ExternalProviderNftsResponse> {
    return this.apiClient.get(`external-provider-nfts`, { address, chainName });
  }
  getNftMetadata({
    chainName,
    tokenAddress,
    tokenId,
  }: {
    chainName: string;
    tokenAddress: string;
    tokenId: string;
  }): Promise<ExternalProviderNftsMetadataResponse> {
    return this.apiClient.get('external-provider-nfts-metadata', {
      chainName,
      tokenAddress,
      tokenId,
    });
  }
}
