import Base from './base';

export default class Metamask extends Base {
  verifyMetamask(data: {
    address: string;
    chainId: number;
    refId: string;
  }): Promise<{ token?: string; isVerified: boolean }> {
    return this.apiClient.get('verify-gated-registration', data);
  }
}
