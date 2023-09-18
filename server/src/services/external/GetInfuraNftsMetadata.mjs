import moralisNftsApi from '../../external/moralis-nft.mjs';

import logger from '../../logger';
import Base from '../Base';
import X from '../Exception';

export default class GetInfuraNftsMetadata extends Base {
  static get validationRules() {
    return {
      chainName: ['string'],
      tokenAddress: ['string'],
      tokenId: ['string'],
    };
  }

  async execute({ chainName, tokenAddress, tokenId }) {
    try {
      const res = await moralisNftsApi.getNftMetadata({
        chainName,
        tokenAddress,
        tokenId,
      });

      return {
        data: res,
      };
    } catch (error) {
      logger.error(`External Nfts Metadata get: ${error}`);
      throw new X({
        code: 'SERVER_ERROR',
        fields: {
          infuraNfts: 'SERVER_ERROR',
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
