import Moralis from 'moralis';
import { EvmChain } from '@moralisweb3/common-evm-utils';

import logger from '../logger';
import config from '../config/index.mjs';

const CHUNK_SIZE = 2;
const DELAY_BETWEEN_CHUNKS = 500;
const FIO_NFT_POLYGON_CONTRACT = process.env.FIO_NFT_POLYGON_CONTRACT || '';

class GetMoralisNfts {
  async init() {
    if (!Moralis.Core._isStarted)
      await Moralis.start({
        apiKey: config.nfts.apiKey,
      });
  }

  async resyncNftMetadata({ chain, nftItem }) {
    try {
      await Moralis.EvmApi.nft.reSyncMetadata({
        chain,
        flag: 'uri',
        mode: 'async',
        address: nftItem.token_address,
        tokenId: nftItem.token_id,
      });
    } catch (error) {
      logger.error(`Resync uri for token id - ${nftItem.token_id}: `, error.message);
    }

    try {
      await Moralis.EvmApi.nft.reSyncMetadata({
        chain,
        flag: 'metadata',
        mode: 'async',
        address: nftItem.token_address,
        tokenId: nftItem.token_id,
      });
    } catch (error) {
      logger.error(`Resync metadata for token id - ${nftItem.token_id}: `, error.message);
    }

    try {
      const nftItemWithFreshMetadataRes = await Moralis.EvmApi.nft.getNFTMetadata({
        chain,
        address: nftItem.token_address,
        tokenId: nftItem.token_id,
        normalizeMetadata: true,
        format: 'decimal',
        mediaItems: false,
      });
      return nftItemWithFreshMetadataRes.toJSON();
    } catch (error) {
      logger.error(`Get metadata for token id - ${nftItem.token_id}: `, error.message);
    }
  }

  async getWalletNfts({ address, chainName = config.nfts.defaultChainName, cursor }) {
    const chain = EvmChain[chainName];
    return await Moralis.EvmApi.nft.getWalletNFTs({
      address,
      chain,
      cursor,
      format: 'decimal',
      mediaItems: false,
      normalizeMetadata: true,
      tokenAddresses: [FIO_NFT_POLYGON_CONTRACT],
    });
  }

  async getAllWalletNfts({ address, chainName = config.nfts.defaultChainName, cursor }) {
    await this.init();
    const nftsList = [];

    let walletNftsRes = {};
    if (cursor) {
      walletNftsRes = await cursor.next();
    } else {
      walletNftsRes = (await this.getWalletNfts({ address, chainName, cursor })) || {};
    }

    const walletNftsResData = walletNftsRes.toJSON();

    if (walletNftsResData && walletNftsResData.result) {
      nftsList.push(...walletNftsResData.result);

      if (walletNftsRes.hasNext()) {
        await this.getAllWalletNfts({ cursor: walletNftsRes });
      }
    }

    if (nftsList.some(nftItem => nftItem.metadata == null)) {
      const nftItemsWithNoMetadata = nftsList.filter(nftItem => nftItem.metadata == null);
      const nftItemsWithSyncedMetadata = [];

      const processChunk = async chunk => {
        const nftMetadataPromises = chunk.map(nftItem => this.resyncNftMetadata(nftItem));

        const chunkResults = await Promise.allSettled(nftMetadataPromises);

        const resolvedChunkResults = chunkResults
          .filter(result => result.status === 'fulfilled')
          .map(result => result.value);

        nftItemsWithSyncedMetadata.push(...resolvedChunkResults);
      };

      for (let i = 0; i < nftItemsWithNoMetadata.length; i += CHUNK_SIZE) {
        const chunk = nftItemsWithNoMetadata.slice(i, i + CHUNK_SIZE);

        await processChunk(chunk);

        if (i + CHUNK_SIZE < nftItemsWithNoMetadata.length) {
          await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_CHUNKS));
        }
      }

      if (nftItemsWithSyncedMetadata.length) {
        for (const nftItemWithSyncedMetadata of nftItemsWithSyncedMetadata) {
          const nonUpdatedMetadataNftItem = nftsList.find(
            nftItem => nftItem.token_id === nftItemWithSyncedMetadata.token_id,
          );

          if (nonUpdatedMetadataNftItem) {
            nonUpdatedMetadataNftItem.metadata = nftItemWithSyncedMetadata.metadata;
            nonUpdatedMetadataNftItem.normalized_metadata =
              nftItemWithSyncedMetadata.normalized_metadata;
          }
        }
      }
    }
    return nftsList;
  }
}

export default new GetMoralisNfts();
