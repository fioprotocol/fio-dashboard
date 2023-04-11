import Base from './base';
import { VerifyTwitterResponse } from './responses';

export default class VerifyTwitter extends Base {
  verifyTwitter(data: {
    fch: string;
    token?: string;
    twh: string;
  }): Promise<VerifyTwitterResponse> {
    return this.apiClient.post('verify-twitter', data);
  }
}
