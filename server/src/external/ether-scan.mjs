import superagent from 'superagent';
import { ethers } from 'ethers';

const API_KEY_RATE_LIMIT_ERROR = 'Max rate limit reached';

export default class EtherScan {
  constructor() {
    this.etherscanApiUrl = process.env.ETHERSCAN_API_URL;
    this.etherscanGasTrackerApiUrl = process.env.ETHERSCAN_GASTRACKER_API_URL;
    this.etherscanApiKey = process.env.ETHERSCAN_API_KEY;
    this.polygonscanApiUrl = process.env.POLYGONSCAN_API_URL;
    this.polygonscanGasTrackerApiUrl = process.env.POLYGONSCAN_GASTRACKER_API_URL;
    this.polygonscanApiKey = process.env.POLYGONSCAN_API_KEY;
  }

  getGasOracle({ isPolygon = false }) {
    return this._request(
      {
        module: 'gastracker',
        action: 'gasoracle',
      },
      isPolygon,
    );
  }

  getEstimationOfConfirmationTime({
    gasPrice, //gwei
  }) {
    return this._request({
      module: 'gastracker',
      action: 'gasestimate',
      gasprice: ethers.utils.parseUnits(gasPrice, 'gwei').toString(), //wei
    }).then(value => {
      if (value === API_KEY_RATE_LIMIT_ERROR) return '';
      return value;
    });
  }

  _request(params, isPolygon = false, apiUrlParam) {
    const apiUrl =
      apiUrlParam ||
      (isPolygon ? this.polygonscanGasTrackerApiUrl : this.etherscanGasTrackerApiUrl);

    const req = superagent.get(apiUrl);

    if (params)
      req.query({
        ...params,
        apikey: isPolygon ? this.polygonscanApiKey : this.etherscanApiKey,
      });

    return req.then(res => {
      if (!res.body && !res.body.result) throw res.body.error || JSON.stringify(res.body);
      return res.body.result;
    });
  }
}
