import Base from './base';

import { RefProfileGetResponse } from './responses';

export default class RefProfile extends Base {
  get(code: string): Promise<RefProfileGetResponse> {
    return this.apiClient.get(`ref-profile/${code}`);
  }
}
