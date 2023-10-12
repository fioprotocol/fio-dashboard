import Base from './base';

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

export default class InfuraApi extends Base {
  async getGasOracle({
    isPolygon = false,
  }: {
    isPolygon: boolean;
  }): Promise<GasOracleResult> {
    return this.apiClient.get('gas-oracle', { isPolygon });
  }
}
