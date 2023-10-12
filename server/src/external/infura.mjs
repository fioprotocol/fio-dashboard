import superagent from 'superagent';

export default class InfuraApi {
  constructor() {
    this.ethApiUrl = process.env.ETH_INFURA_BASE_URL;
    this.infuraApiKey = process.env.INFURA_API_KEY;
    this.polygonApiUrl = process.env.POLYGON_INFURA_BASE_URL;
  }

  // base gas price value + 10%
  calculateAverageGasPrice(val) {
    return Math.ceil(val + val * 0.1);
  }

  // base gas price value + 20%
  calculateHighGasPrice(val) {
    return Math.ceil(val + val * 0.2);
  }

  async getGasOracle({ isPolygon = false }) {
    const lowGasPrice = await this._request({
      isPolygon,
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

  _request({ isPolygon, method = 'post', params, body }) {
    const req = superagent[method](
      `${isPolygon ? this.polygonApiUrl : this.ethApiUrl}${this.infuraApiKey}`,
    );

    if (params) req.query(params);
    if (body) req.send(body);

    return req.then(res => {
      if (!res.body && !res.body.result) throw res.body.error || JSON.stringify(res.body);
      return parseInt(res.body.result);
    });
  }
}
