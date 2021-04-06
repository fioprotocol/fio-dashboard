import superagent from 'superagent';

export default class FioReg {
  baseurl = 'https://reg.fioprotocol.io/';

  prices() {
    return this._request({
      url: 'public-api/get-pricing/fio',
      method: 'get',
    });
  }

  domains() {
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
