import Base from './base';

export type GasOracleResult = {
  SafeGasPrice: string;
  ProposeGasPrice: string;
  FastGasPrice: string;
};

export default class InfuraApi extends Base {
  async getGasOracle({
    isPolygon = false,
  }: {
    isPolygon: boolean;
  }): Promise<GasOracleResult> {
    return this.apiClient.get('gas-oracle', {
      isPolygon,
      isInfuraProvider: true,
    });
  }
}
