import infuraNftApi from '../../external/infura-nft.mjs';

import logger from '../../logger';
import Base from '../Base';
import X from '../Exception';

export default class GetInfuraNfts extends Base {
  static get validationRules() {
    return {
      account: ['required', 'string'],
      chainId: ['string'],
    };
  }

  async execute({ account, chainId }) {
    try {
      const res = await infuraNftApi.getAllNftsFromAccount({ account, chainId });

      return { data: res };
    } catch (error) {
      logger.error(`InfuraNfts get: ${error}`);
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
    return [];
  }
}
