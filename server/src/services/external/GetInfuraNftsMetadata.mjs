import infuraNftApi from '../../external/infura-nft.mjs';

import logger from '../../logger';
import Base from '../Base';
import X from '../Exception';

export default class GetInfuraNftsMetadata extends Base {
  static get validationRules() {
    return {
      chainId: ['string'],
      tokenAddress: ['string'],
      tokenId: ['string'],
    };
  }

  async execute({ chainId, tokenAddress, tokenId }) {
    try {
      const res = await infuraNftApi.getNftMetadata({
        chainId,
        tokenAddress,
        tokenId,
      });

      return {
        data: res,
      };
    } catch (error) {
      logger.error(`InfuraNftsMetadata get: ${error}`);
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
