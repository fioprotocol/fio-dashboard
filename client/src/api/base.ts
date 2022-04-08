import ApiClient from './client';

export default class Base {
  apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    if (!apiClient) throw new Error('[apiClient] required');
    this.apiClient = apiClient;
  }
}
