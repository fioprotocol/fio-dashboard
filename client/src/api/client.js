import superagent from 'superagent';
import config from '../config';

export default class ApiClient {
  constructor(prefix) {
    if (!prefix) throw new Error('[apiPrefix] required');
    this.prefix = prefix;
    this.baseUrl = config.apiBaseUrl;
    this.token = window.localStorage.getItem('token') || null;
  }

  setToken(token) {
    this.token = token;
    window.localStorage.setItem('token', token);
  }

  removeToken() {
    this.token = null;
    window.localStorage.removeItem('token');
  }

  get(url, params = {}) {
    return this._request({ url, method: 'get', params });
  }

  post(url, body) {
    return this._request({ url, method: 'post', body });
  }

  patch(url, body) {
    return this._request({ url, method: 'patch', body });
  }

  put(url, body) {
    return this._request({ url, method: 'put', body });
  }

  delete(url, body) {
    return this._request({ url, method: 'delete', body });
  }

  _request({ url, method, params, body }) {
    const req = superagent[method](`${this.baseUrl}${this.prefix}${url}`);

    if (params) req.query(params);
    if (body) req.send(body);
    if (this.token) req.set('Authorization', `Bearer ${this.token}`);

    return req.then(res => {
      if (!res.body.status) throw res.body.error;
      return res.body.data;
    });
  }
}
