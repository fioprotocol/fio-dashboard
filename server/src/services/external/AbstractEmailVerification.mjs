import logger from '../../logger';
import Base from '../Base';

import { abstractEmailValidation } from '../../external/abstract-email-validation.mjs';

export default class AbstractEmailVerification extends Base {
  static get validationRules() {
    return {
      email: ['required', 'string'],
    };
  }
  async execute({ email }) {
    try {
      const data = await abstractEmailValidation({ email });
      return { data };
    } catch (error) {
      logger.error(`Abstract validation email error: ${error}`);
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
