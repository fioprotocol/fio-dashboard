import Base from '../Base';
import { FioApiUrl } from '../../models';

export default class ApiUrls extends Base {
  async execute() {
    const apiUrls = await FioApiUrl.getApiUrls();

    return {
      data: apiUrls,
    };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return [];
  }
}
