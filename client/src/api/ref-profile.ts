import Base from './base';

export default class RefProfile extends Base {
  get(code: string) {
    return this.apiClient.get(`ref-profile/${code}`);
  }
}
