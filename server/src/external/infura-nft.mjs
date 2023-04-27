import superagent from 'superagent';

import config from '../config/index.mjs';
import logger from '../logger.mjs';

const INFURA_NFT_BASE_URL = config.infura.nftBaseUrl || 'https://nft.api.infura.io/';
const INFURA_AUTH_BASE_64 = Buffer.from(
  config.infura.apiKey + ':' + config.infura.apiSecret,
).toString('base64');

class InfuraNftApi {
  async getNftsFromAccount(account, chainId = config.infura.defaultChainId, params) {
    try {
      const infuraUrl = `${INFURA_NFT_BASE_URL}networks/${chainId}/accounts/${account}/assets/nfts`;

      return await superagent
        .get(infuraUrl)
        .query(params)
        .set('Authorization', `Basic ${INFURA_AUTH_BASE_64}`);
    } catch (error) {
      logger.error(
        `Infura get NFTS from account Error: account - ${account}, chainId - ${chainId}`,
        error,
      );
      throw new Error(error);
    }
  }

  async getAllNftsFromAccount({ account, chainId, params, nftsList = [] }) {
    try {
      const { body: res } =
        (await this.getNftsFromAccount(account, chainId, params)) || {};

      if (res && res.assets) {
        nftsList.push(...res.assets);

        if (nftsList.length < res.total) {
          const params = { cursor: res.cursor };

          return this.getAllNftsFromAccount({
            account,
            chainId,
            params,
            nftsList,
          });
        }
      }
      return nftsList;
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default new InfuraNftApi();
