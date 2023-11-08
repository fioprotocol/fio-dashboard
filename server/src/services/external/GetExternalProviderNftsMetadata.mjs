import moralisApi from '../../external/moralis.mjs';

import logger from '../../logger';
import Base from '../Base';
import X from '../Exception';

export default class GetExternalProviderNftsMetadata extends Base {
  static get validationRules() {
    return {
      chainName: ['string'],
      tokenAddress: ['string'],
      tokenId: ['string'],
    };
  }

  async execute({ chainName, tokenAddress, tokenId }) {
    try {
      const res = await moralisApi.getNftMetadata({
        chainName,
        tokenAddress,
        tokenId,
      });

      return {
        data: res,
      };
    } catch (error) {
      logger.error(`Get External Provider Nfts Metadata: ${error}`);
      throw new X({
        code: 'SERVER_ERROR',
        fields: {
          externalProviderMetadataNfts: 'SERVER_ERROR',
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
