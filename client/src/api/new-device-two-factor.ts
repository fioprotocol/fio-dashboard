import Base from './base';

export default class NewDeviceTwoFactor extends Base {
  create({
    email,
    voucherId,
    deviceDescription,
  }: {
    email: string;
    voucherId: string;
    deviceDescription: string;
  }) {
    return this.apiClient.post('new-device-two-factor', {
      data: { email, voucherId, deviceDescription },
    });
  }
  delete(voucherId: string) {
    return this.apiClient.delete('new-device-two-factor', {
      voucherId,
    });
  }
}
