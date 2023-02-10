import superagent from 'superagent';

class FioReg {
  constructor() {
    this.baseurl = process.env.FIO_REG_BASE_URL;
    this.defaultRef = process.env.FIO_REG_DEFAULT_REF;
  }

  prices() {
    return this._request({
      url: `public-api/get-pricing/${this.defaultRef}`,
      method: 'get',
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
