import superagent from 'superagent';

import { AnyObject } from '../types';

export type GasOracleResult = {
  SafeGasPrice: string;
  ProposeGasPrice: string;
  FastGasPrice: string;
};

export type InfuraResponse = {
  status: string;
  result: string;
  error?: AnyObject;
};

export default class InfuraApi {
  ethApiUrl: string;
  infuraApiKey: string;
  polygonApiUrl: string;

  constructor() {
    this.ethApiUrl = process.env.REACT_APP_ETH_INFURA;
    this.infuraApiKey = process.env.REACT_APP_INFURA_KEY;
    this.polygonApiUrl = process.env.REACT_APP_POLYGON_INFURA;
  }

  // base gas price value + 10%
  calculateAverageGasPrice(val: number): number {
    return Math.ceil(val + val * 0.1);
  }

  // base gas price value + 20%
  calculateHighGasPrice(val: number): number {
    return Math.ceil(val + val * 0.2);
  }

  async getGasOracle(isPolygon: boolean = false): Promise<GasOracleResult> {
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

  _request({
    isPolygon,
    method = 'post',
    params,
    body,
  }: {
    params?: Object;
    isPolygon: boolean;
    body?: Object;
    method?: 'get' | 'post' | 'patch' | 'put' | 'delete';
  }): Promise<number> {
    const req = superagent[method](
      `${isPolygon ? this.polygonApiUrl : this.ethApiUrl}${this.infuraApiKey}`,
    );

    if (params) req.query(params);
    if (body) req.send(body);

    return req.then((res: { body: InfuraResponse }) => {
      if (!res.body?.result) throw res.body.error || JSON.stringify(res.body);
      return parseInt(res.body.result);
    });
  }
}
