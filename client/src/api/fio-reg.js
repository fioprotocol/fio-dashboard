import superagent from 'superagent';

export default class FioReg {
  baseurl = 'https://reg.fioprotocol.io/';

  prices() {
    return Promise.resolve({
      pricing: {
        fio: {
          domain: 500,
          address: 4,
        },
        usdt: {
          domain: 3,
          address: 1,
        },
      },
    });
    return this._request({
      url: 'public-api/get-pricing/fio',
      method: 'get',
    });
  }

  domains() {
    return Promise.resolve({
      domains: [
        { domain: 'edge', free: true },
        { domain: 'fio', free: true },
      ],
    });
    return this._request({
      url: 'public-api/get-domains/fio',
      method: 'get',
    });
  }

  _request({ url, method, params, body }) {
    const req = superagent[method](`${this.baseurl}${url}`);

    if (params) req.query(params);
    if (body) req.send(body);

    return req.then(res => {
      if (!res.body.status) throw res.body.error;
      return res.body.data;
    });
  }
}
