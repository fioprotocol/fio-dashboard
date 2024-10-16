import Base from './base';
import { VarsResponse } from './responses';

export default class Var extends Base {
  getVar(key: string): Promise<VarsResponse> {
    return this.apiClient.get(`vars/${key}`);
  }

  update(key: string, value: string): Promise<VarsResponse> {
    return this.apiClient.post(`admin/vars/update/${key}`, { value });
  }
}
