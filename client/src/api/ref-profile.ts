import Base from './base';

import {
  RefProfileGetResponse,
  RefProfileGetSettingsResponse,
} from './responses';

export default class RefProfile extends Base {
  get(code: string): Promise<RefProfileGetResponse> {
    return this.apiClient.get(`ref-profile/${code}`);
  }
  getSettings(code: string): Promise<RefProfileGetSettingsResponse> {
    return this.apiClient.get(`ref-profile/settings/${code}`);
  }
}
