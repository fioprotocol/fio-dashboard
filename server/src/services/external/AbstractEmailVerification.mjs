import logger from '../../logger';
import Base from '../Base';

import { abstractEmailValidation } from '../../external/abstract-email-validation.mjs';

import { ABSTRACT_EMAIL_VERIFICATION_RESULTS_STATUS } from '../../config/constants';

export default class AbstractEmailVerification extends Base {
  static get validationRules() {
    return {
      email: ['required', 'string'],
    };
  }
  async execute({ email }) {
    try {
      const abstractEmailVerificationRes = await abstractEmailValidation({
        email,
      });

      let isValid = true;

      if (
        abstractEmailVerificationRes.deliverability &&
        ![
          ABSTRACT_EMAIL_VERIFICATION_RESULTS_STATUS.DELIVERABLE,
          ABSTRACT_EMAIL_VERIFICATION_RESULTS_STATUS.UNKNOWN,
        ].includes(abstractEmailVerificationRes.deliverability)
      ) {
        isValid = false;
      }

      return { data: { isValid } };
    } catch (error) {
      logger.error(`Abstract validation email error: ${error}`);
      return {
        data: { isValid: true },
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
