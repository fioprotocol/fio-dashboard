import moralisApi from '../../external/moralis.mjs';

import logger from '../../logger';
import Base from '../Base';
import X from '../Exception';

export default class GetExternalAllTokens extends Base {
  static get validationRules() {
    return {
      address: ['required', 'string'],
      chainName: ['required', 'string'],
    };
  }

  async execute({ address, chainName }) {
    try {
      const nftsList = await moralisApi.getAllTokens({
        address,
        chainName,
      });

      return { data: nftsList };
    } catch (error) {
      logger.error(`Get External All Tokens: ${error}`);
      throw new X({
        code: 'SERVER_ERROR',
        fields: {
          tokens: 'SERVER_ERROR',
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
