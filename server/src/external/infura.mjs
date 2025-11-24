import superagent from 'superagent';

import config from '../config/index.mjs';
import { CHAIN_CODES } from '../constants/chain.mjs';

const { infura } = config || {};

const { baseUrl, ethBaseUrl, polygonBaseUrl, apiKey } = infura || {};

const getBaseUrl = ({ chainCode }) => {
  if (chainCode === CHAIN_CODES.ETH) return ethBaseUrl;
  if (chainCode === CHAIN_CODES.POL || chainCode === CHAIN_CODES.MATIC)
    return polygonBaseUrl;
  if (chainCode === CHAIN_CODES.BASE) return baseUrl;
  throw new Error(`Invalid chain code: ${chainCode}`);
};

export default class InfuraApi {
  // base gas price value + 10%
  calculateAverageGasPrice(val) {
    return Math.ceil(val + val * 0.1);
  }

  // base gas price value + 20%
  calculateHighGasPrice(val) {
    return Math.ceil(val + val * 0.2);
  }

  async getGasOracle({ chainCode }) {
    const lowGasPrice = await this._request({
      chainCode,
      body: {
        jsonrpc: '2.0',
        method: 'eth_gasPrice',
        params: [],
        id: 1,
      },
    });

    return {
      SafeGasPrice: lowGasPrice + '',
      ProposeGasPrice: this.calculateAverageGasPrice(lowGasPrice) + '',
      FastGasPrice: this.calculateHighGasPrice(lowGasPrice) + '',
    };
  }

  _request({ chainCode, method = 'post', params, body }) {
    const req = superagent[method](`${getBaseUrl({ chainCode })}${apiKey}`);

    if (params) req.query(params);
    if (body) req.send(body);

    return req.then(res => {
      if (!res.body && !res.body.result) throw res.body.error || JSON.stringify(res.body);
      return parseInt(res.body.result);
    });
  }
}
