import Base from './base';

export type GasOracleResult = {
  LastBlock: string;
  SafeGasPrice: string;
  ProposeGasPrice: string;
  FastGasPrice: string;
  suggestBaseFee: string;
  gasUsedRatio: string;
};

export type EstimationOfConfirmationTimeResult = string; // seconds

export default class EtherScan extends Base {
  async getGasOracle({
    isPolygon = false,
  }: {
    isPolygon: boolean;
  }): Promise<GasOracleResult> {
    return this.apiClient.get('gas-oracle', {
      isPolygon,
      isEtherScanProvider: true,
    });
  }

  getEstimationOfConfirmationTime(
    gasPrice: string, //gwei
  ): Promise<EstimationOfConfirmationTimeResult> {
    return this.apiClient.get('estimation-of-confirmation-time', { gasPrice });
  }
}
