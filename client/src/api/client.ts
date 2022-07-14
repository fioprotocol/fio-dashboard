import superagent, { SuperAgentRequest } from 'superagent';

import config from '../config';

import { ApisResponse } from './responses';

export const isAdminService = (url: string) => /admin/g.test(url);

export default class ApiClient {
  prefix: string;
  baseUrl: string;
  token: string | null;
  adminToken: string | null;

  constructor(prefix: string) {
    if (!prefix) throw new Error('[apiPrefix] required');
    this.prefix = prefix;
    this.baseUrl = config.apiBaseUrl || '';
    this.token = window.localStorage.getItem(config.userTokenName) || null;
    this.adminToken =
      window.localStorage.getItem(config.adminTokenName) || null;
  }

  setToken(token: string): void {
    this.token = token;
    window.localStorage.setItem(config.userTokenName, token);
  }

  removeToken(): void {
    this.token = null;
    window.localStorage.removeItem(config.userTokenName);
  }

  setAdminToken(adminToken: string): void {
    this.adminToken = adminToken;
    window.localStorage.setItem(config.adminTokenName, adminToken);
  }

  removeAdminToken(): void {
    this.adminToken = null;
    window.localStorage.removeItem(config.adminTokenName);
  }

  get(url: string, params: Object = {}): Promise<ApisResponse> {
    return this._request({ url, method: 'get', params });
  }

  post(url: string, body: Object): Promise<ApisResponse> {
    return this._request({ url, method: 'post', body });
  }

  patch(url: string, body: Object): Promise<ApisResponse> {
    return this._request({ url, method: 'patch', body });
  }

  put(url: string, body: Object): Promise<ApisResponse> {
    return this._request({ url, method: 'put', body });
  }

  delete(url: string, body: Object): Promise<ApisResponse> {
    return this._request({ url, method: 'delete', body });
  }

  _request({
    url,
    method,
    params,
    body,
  }: {
    url: string;
    method: 'get' | 'post' | 'patch' | 'put' | 'delete';
    params?: Object;
    body?: Object;
  }): Promise<ApisResponse> {
    const req: SuperAgentRequest = superagent[method](
      `${this.baseUrl}${this.prefix}${url}`,
    );

    if (params) req.query(params);
    if (body) req.send(body);

    if (isAdminService(url)) {
      if (this.adminToken)
        req.set('Authorization', `Bearer ${this.adminToken}`);
    } else if (this.token) req.set('Authorization', `Bearer ${this.token}`);

    // todo pass refcode to request

    return req.then(
      (res: {
        body: { status?: number; error?: string; data: ApisResponse };
      }) => {
        if (!res.body.status) throw res.body.error;
        return res.body.data;
      },
    );
  }
}
