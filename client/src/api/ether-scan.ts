import superagent, { SuperAgentRequest } from 'superagent';
import { ethers } from 'ethers';

import { W_FIO_DOMAIN_NFT } from '../constants/ethereum';

import { AnyObject } from '../types';

const API_KEY_RATE_LIMIT_ERROR = 'Max rate limit reached';

export type GasOracleResult = {
  LastBlock: string;
  SafeGasPrice: string;
  ProposeGasPrice: string;
  FastGasPrice: string;
  suggestBaseFee: string;
  gasUsedRatio: string;
};

export type LogItem = {
  blockHash: string;
  blockNumber: string;
  confirmations: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  from: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  hash: string;
  input: string;
  nonce: string;
  timeStamp: string;
  to: string;
  tokenDecimal: string;
  tokenID: string;
  tokenName: string;
  tokenSymbol: string;
  transactionIndex: string;
};

export type EstimationOfConfirmationTimeResult = string; // seconds

export type LogResult = LogItem[];

export type EtherscanResponse = {
  status: string;
  message: string;
  result: GasOracleResult & EstimationOfConfirmationTimeResult & LogResult;
  error?: AnyObject;
};

export default class EtherScan {
  etherscanApiUrl: string;
  etherscanGasTrackerApiUrl: string;
  etherscanApiKey: string;
  polygonscanApiUrl: string;
  polygonscanGasTrackerApiUrl: string;
  polygonscanApiKey: string;

  constructor() {
    this.etherscanApiUrl = process.env.REACT_APP_ETHERSCAN_API_URL;
    this.etherscanGasTrackerApiUrl =
      process.env.REACT_APP_ETHERSCAN_GASTRACKER_API_URL;
    this.etherscanApiKey = process.env.REACT_APP_ETHERSCAN_API_KEY;
    this.polygonscanApiUrl = process.env.REACT_APP_POLYGONSCAN_API_URL;
    this.polygonscanGasTrackerApiUrl =
      process.env.REACT_APP_POLYGONSCAN_GASTRACKER_API_URL;
    this.polygonscanApiKey = process.env.REACT_APP_POLYGONSCAN_API_KEY;
  }

  getGasOracle(isPolygon: boolean = false): Promise<GasOracleResult> {
    return this._request(
      {
        module: 'gastracker',
        action: 'gasoracle',
      },
      isPolygon,
    );
  }

  // max 10000 token log items per request
  getNftsTransferEventLogs(
    page = 1,
    offset = 100,
    address: string,
  ): Promise<LogItem[]> {
    return this._request(
      {
        module: 'account',
        action: 'tokennfttx',
        contractaddress: W_FIO_DOMAIN_NFT.address,
        address,
        offset,
        page,
      },
      true,
      this.polygonscanApiUrl,
    );
  }

  getEstimationOfConfirmationTime(
    gasprice: string, //gwei
  ): Promise<EstimationOfConfirmationTimeResult> {
    return this._request({
      module: 'gastracker',
      action: 'gasestimate',
      gasprice: ethers.utils.parseUnits(gasprice, 'gwei').toString(), //wei
    }).then(value => {
      if (value === API_KEY_RATE_LIMIT_ERROR) return '';
      return value;
    });
  }

  _request(
    params: Object,
    isPolygon: boolean = false,
    apiUrlParam?: string,
  ): Promise<GasOracleResult & EstimationOfConfirmationTimeResult & LogResult> {
    const apiUrl =
      apiUrlParam ||
      (isPolygon
        ? this.polygonscanGasTrackerApiUrl
        : this.etherscanGasTrackerApiUrl);

    const req: SuperAgentRequest = superagent.get(apiUrl);

    if (params)
      req.query({
        ...params,
        apikey: isPolygon ? this.polygonscanApiKey : this.etherscanApiKey,
      });

    return req.then((res: { body: EtherscanResponse }) => {
      if (!res.body.result) throw res.body.error || JSON.stringify(res.body);
      return res.body.result;
    });
  }
}
