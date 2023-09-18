import moralisNftsApi from '../../external/moralis-nft.mjs';

import logger from '../../logger';
import config from '../../config/index.mjs';
import Base from '../Base';
import X from '../Exception';

export default class GetExternalProviderNfts extends Base {
  static get validationRules() {
    return {
      address: ['required', 'string'],
      chainName: ['string'],
    };
  }

  async execute({ address, chainName = config.nfts.defaultChainName }) {
    try {
      const nftsList = await moralisNftsApi.getAllWalletNfts({
        address,
        chainName,
      });

      return { data: nftsList };
    } catch (error) {
      logger.error(`Get External Provider NFTs: ${error}`);
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
