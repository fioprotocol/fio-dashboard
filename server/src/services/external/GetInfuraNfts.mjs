import Moralis from 'moralis';
import { EvmChain } from '@moralisweb3/common-evm-utils';

import logger from '../../logger';
import config from '../../config/index.mjs';
import Base from '../Base';
import X from '../Exception';

const CHUNK_SIZE = 2;
const DELAY_BETWEEN_CHUNKS = 100;
const FIO_NFT_POLYGON_CONTRACT = process.env.FIO_NFT_POLYGON_CONTRACT || '';

export default class GetInfuraNfts extends Base {
  static get validationRules() {
    return {
      address: ['required', 'string'],
      chainName: ['string'],
    };
  }

  async execute({ address, chainName = config.nfts.defaultChainName }) {
    if (!Moralis.Core._isStarted)
      await Moralis.start({
        apiKey: config.nfts.apiKey,
      });

    const chain = EvmChain[chainName];

    const nftsList = [];

    try {
      const getWalletNfts = async cursor =>
        await Moralis.EvmApi.nft.getWalletNFTs({
          address,
          chain,
          cursor,
          format: 'decimal',
          mediaItems: false,
          normalizeMetadata: true,
          tokenAddresses: [FIO_NFT_POLYGON_CONTRACT],
        });

      const getAllWalletNfts = async ({ cursor }) => {
        let walletNftsRes = {};
        if (cursor) {
          walletNftsRes = await cursor.next();
        } else {
          walletNftsRes = (await getWalletNfts()) || {};
        }

        const walletNftsResData = walletNftsRes.toJSON();

        if (walletNftsResData && walletNftsResData.result) {
          nftsList.push(...walletNftsResData.result);

          if (walletNftsRes.hasNext()) {
            await getAllWalletNfts({ cursor: walletNftsRes });
          }
        }
      };

      await getAllWalletNfts({});

      if (nftsList.some(nftItem => nftItem.metadata == null)) {
        const nftItemsWithNoMetadata = nftsList.filter(
          nftItem => nftItem.metadata == null,
        );

        const nftItemsWithSyncedMetadata = [];

        const resyncedNftMetadata = async nftItem => {
          try {
            await Moralis.EvmApi.nft.reSyncMetadata({
              chain,
              flag: 'uri',
              mode: 'async',
              address: FIO_NFT_POLYGON_CONTRACT,
              tokenId: nftItem.token_id,
            });
          } catch (error) {
            logger.error(
              `Resync uri for token id - ${nftItem.token_id}: `,
              error.message,
            );
          }

          try {
            await Moralis.EvmApi.nft.reSyncMetadata({
              chain,
              flag: 'metadata',
              mode: 'async',
              address: FIO_NFT_POLYGON_CONTRACT,
              tokenId: nftItem.token_id,
            });
          } catch (error) {
            logger.error(
              `Resync metadata for token id - ${nftItem.token_id}: `,
              error.message,
            );
          }

          try {
            const nftItemWithFreshMetadataRes = await Moralis.EvmApi.nft.getNFTMetadata({
              chain,
              address: FIO_NFT_POLYGON_CONTRACT,
              tokenId: nftItem.token_id,
              normalizeMetadata: true,
              format: 'decimal',
              mediaItems: false,
            });
            return nftItemWithFreshMetadataRes.toJSON();
          } catch (error) {
            logger.error(
              `Get metadata for token id - ${nftItem.token_id}: `,
              error.message,
            );
          }
        };

        const processChunk = async chunk => {
          const nftMetadataPromises = chunk.map(nftItem => resyncedNftMetadata(nftItem));

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

      return { data: nftsList };
    } catch (error) {
      logger.error(`FIO NFTs get: ${error}`);
      throw new X({
        code: 'SERVER_ERROR',
        fields: {
          fioNfts: 'SERVER_ERROR',
        },
      });
    }
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return ['*'];
  }
}
