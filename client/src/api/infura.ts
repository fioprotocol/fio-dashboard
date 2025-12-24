import Base from './base';

export type GasOracleResult = {
  SafeGasPrice: string;
  ProposeGasPrice: string;
  FastGasPrice: string;
};

export default class InfuraApi extends Base {
  async getGasOracle({
    chainCode,
  }: {
    chainCode: string;
  }): Promise<GasOracleResult> {
    return this.apiClient.get('gas-oracle', {
      chainCode,
      isInfuraProvider: true,
    });
  }
}
