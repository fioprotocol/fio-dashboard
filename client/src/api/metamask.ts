import Base from './base';

export default class Metamask extends Base {
  verifyMetamask(data: {
    address: string;
    refId: string;
    signedMessage: string;
  }): Promise<{ token?: string; isVerified: boolean }> {
    return this.apiClient.get('verify-gated-registration', data);
  }
}
