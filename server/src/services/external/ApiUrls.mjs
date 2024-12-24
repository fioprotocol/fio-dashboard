import Base from '../Base';
import { FioApiUrl } from '../../models';

export default class ApiUrls extends Base {
  static get validationRules() {
    return {
      fioUrlType: ['required', 'string'],
      tz: 'string',
    };
  }
  async execute({ fioUrlType, tz }) {
    const apiUrls = await FioApiUrl.getApiUrls({
      type: fioUrlType,
      tz,
    });

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
