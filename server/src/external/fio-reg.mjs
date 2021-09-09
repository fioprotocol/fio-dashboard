import superagent from 'superagent';

class FioReg {
  constructor() {
    this.baseurl = process.env.FIO_REG_BASE_URL;
    this.apiToken = process.env.FIO_REG_API_TOKEN;
    this.defaultRef = process.env.FIO_REG_DEFAULT_REF;
  }

  prices() {
    return this._request({
      url: `public-api/get-pricing/${this.defaultRef}`,
      method: 'get',
    });
  }

  domains() {
    return this._request({
      url: `public-api/get-domains/${this.defaultRef}`,
      method: 'get',
    });
  }

  /**
   *
   * @param body
   * @param body.address
   * @param body.publicKey
   * @param body.referralCode
   * @param body.apiToken
   * @returns {*}
   */
  register(body) {
    if (!body.apiToken) body.apiToken = this.apiToken;
    if (!body.referralCode) body.referralCode = this.defaultRef;
    return this._request({
      url: 'public-api/buy-address',
      method: 'post',
      body,
    });
  }

  _request({ url, method, params, body }) {
    const req = superagent[method](`${this.baseurl}${url}`);

    if (params) req.query(params);
    if (body) req.send(body);

    return req.then(res => {
      if (!res.status) throw res.body.error;
      return res.body;
    });
  }
}

export const FioRegApi = new FioReg();
