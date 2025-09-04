import { FIO_API_URLS_TYPES } from '../constants/fio';
import Base from './base';

import { getUserTz } from '../util/general';

import {
  FioRegApiUrlsResponse,
  FioRegCaptchaResponse,
  FioRegPricesResponse,
} from './responses';

export default class FioReg extends Base {
  prices(actual = false): Promise<FioRegPricesResponse> {
    return this.apiClient.get('reg/prices', {
      actual,
    });
  }
  initCaptcha(): Promise<FioRegCaptchaResponse> {
    return this.apiClient.post('reg/captcha/init', {});
  }
  apiUrls(): Promise<FioRegApiUrlsResponse> {
    return this.apiClient.get('reg/api-urls', {
      fioUrlType: FIO_API_URLS_TYPES.DASHBOARD_API,
      tz: getUserTz(),
    });
  }
  historyUrls(): Promise<FioRegApiUrlsResponse> {
    return this.apiClient.get('reg/api-urls', {
      fioUrlType: FIO_API_URLS_TYPES.DASHBOARD_HISTORY_URL,
      tz: getUserTz(),
    });
  }
  checkServerTime({
    fioApiUrls,
  }: {
    fioApiUrls: string[];
  }): Promise<FioRegApiUrlsResponse> {
    return this.apiClient.get('external/check-fio-api-url-time', {
      fioApiUrls,
    });
  }
}
