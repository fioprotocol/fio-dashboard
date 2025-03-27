import superagent, { SuperAgentRequest } from 'superagent';

import config from '../config';
import { getDeviceInfo } from '../util/deviceInfo';

import { ApisResponse } from './responses';

export const isAdminService = (url: string): boolean => /admin/g.test(url);
export const isGuestService = (url: string): boolean => /guest/g.test(url);

export default class ApiClient {
  prefix: string;
  baseUrl: string;
  token: string | null;
  guestToken: string | null;
  adminToken: string | null;

  constructor(prefix: string) {
    if (!prefix) throw new Error('[apiPrefix] required');
    this.prefix = prefix;
    this.baseUrl = config.apiBaseUrl || '';
    this.token = window.localStorage.getItem(config.userTokenName) || null;
    this.guestToken =
      window.localStorage.getItem(config.guestTokenName) || null;
    this.adminToken =
      window.localStorage.getItem(config.adminTokenName) || null;
  }

  setToken(token: string): void {
    this.token = token;
    window.localStorage.setItem(config.userTokenName, token);
  }

  getToken(): string {
    return this.token || window.localStorage.getItem(config.userTokenName);
  }

  removeToken(): void {
    this.token = null;
    window.localStorage.removeItem(config.userTokenName);
  }

  setGuestToken(token: string): void {
    this.guestToken = token;
    window.localStorage.setItem(config.guestTokenName, token);
  }

  getGuestToken(): string {
    return (
      this.guestToken || window.localStorage.getItem(config.guestTokenName)
    );
  }

  removeGuestToken(): void {
    this.guestToken = null;
    window.localStorage.removeItem(config.guestTokenName);
  }

  setAdminToken(adminToken: string): void {
    this.adminToken = adminToken;
    window.localStorage.setItem(config.adminTokenName, adminToken);
  }

  getAdminToken(): string {
    return (
      this.adminToken || window.localStorage.getItem(config.adminTokenName)
    );
  }

  removeAdminToken(): void {
    this.adminToken = null;
    window.localStorage.removeItem(config.adminTokenName);
  }

  getDeviceToken(): string {
    return window.localStorage.getItem(config.deviceTokenName);
  }

  setDeviceToken(token: string): void {
    window.localStorage.setItem(config.deviceTokenName, token);
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

  delete(url: string, body?: Object): Promise<ApisResponse> {
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
    req.withCredentials();

    // Add device info to all requests
    const deviceInfo = getDeviceInfo();
    const deviceToken = this.getDeviceToken();
    req.set('X-Device-Info', JSON.stringify({ ...deviceInfo, deviceToken }));

    if (isAdminService(url) && this.adminToken) {
      req.set('Authorization', `Bearer ${this.getAdminToken()}`);
    } else if (this.token && !isGuestService(url)) {
      req.set('Authorization', `Bearer ${this.getToken()}`);
    } else {
      req.set('Authorization', `Bearer ${this.getGuestToken()}`);
    }

    // TODO: pass refcode to request?

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
