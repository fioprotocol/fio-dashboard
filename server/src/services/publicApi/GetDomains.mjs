import Base from '../Base';
import {
  generateErrorResponse,
  generateSuccessResponse,
  resolveRefProfileDomains,
} from '../../utils/publicApi.mjs';
import { PUB_API_ERROR_CODES } from '../../constants/pubApiErrorCodes.mjs';
import { ReferrerProfile } from '../../models/index.mjs';
import { HTTP_CODES } from '../../constants/general.mjs';

export default class GetDomains extends Base {
  async execute(args) {
    try {
      return await this.processing(args);
    } catch (e) {
      return generateErrorResponse(this.res, {
        error: `Server error. Please try later.`,
        errorCode: PUB_API_ERROR_CODES.SERVER_ERROR,
        statusCode: HTTP_CODES.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async processing({ referralCode }) {
    const refNotFoundRes = {
      error: 'Referral code not found',
      errorCode: PUB_API_ERROR_CODES.REF_NOT_FOUND,
      statusCode: HTTP_CODES.NOT_FOUND,
    };

    if (!referralCode) {
      return generateErrorResponse(this.res, refNotFoundRes);
    }

    const refProfile = await ReferrerProfile.findOne({
      where: {
        type: ReferrerProfile.TYPE.REF,
        code: referralCode,
      },
    });

    if (!refProfile) {
      return generateErrorResponse(this.res, refNotFoundRes);
    }

    const domains = resolveRefProfileDomains(refProfile).map(({ name, isPremium }) => ({
      domain: name,
      free: !isPremium,
    }));

    return generateSuccessResponse(this.res, { domains });
  }

  static get validationRules() {
    return {
      referralCode: ['required', 'string'],
    };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return ['success'];
  }
}
