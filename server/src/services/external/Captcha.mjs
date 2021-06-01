import logger from '../../logger';
import Base from '../Base';
import { registerCaptcha } from '../../external/captcha';

export default class Captcha extends Base {
  async execute() {
    try {
      const data = await registerCaptcha();
      return { data };
    } catch (error) {
      logger.error(`Register error: ${error}`);
      return {
        data: { success: false, error },
      };
    }
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return [];
  }
}
