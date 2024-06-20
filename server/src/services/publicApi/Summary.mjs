import Base from '../Base';
import { generateSummaryResponse, generateErrorResponse } from '../../utils/publicApi.mjs';
import { PUB_API_ERROR_CODES } from '../../constants/pubApiErrorCodes.mjs';
import { FIOSDK } from '@fioprotocol/fiosdk';
import { HTTP_CODES } from '../../constants/general.mjs';

export default class Summary extends Base {
  async execute({ publicKey, referralCode, externId, address, domain, type, accountPayId }) {
    if(address === '') address = null;
    if(domain === '') domain = null;
    if(externId === '') externId = null;

    if (!address && !domain && !externId) {
      return generateErrorResponse(this.res, {
        error: `publicKey, domain, or externId is required`,
        errorCode: PUB_API_ERROR_CODES.NO_PUBLIC_KEY_SPECIFIED,
        statusCode: HTTP_CODES.BAD_REQUEST,
      });
    }

    if(!referralCode) {
      // TODO add new ENV variable or replace another value
      referralCode = process.env.DEFAULT_REFERRAL_CODE
    }

    // TODO add where values (type)

    if(domain) {
      // TODO add where values (address, domain)

      if(publicKey) {
        if(!FIOSDK.isFioPublicKeyValid(publicKey)) {
          return generateErrorResponse(this.res, {
            error: 'Invalid public key',
            errorCode: PUB_API_ERROR_CODES.NO_PUBLIC_KEY_SPECIFIED,
            statusCode: HTTP_CODES.BAD_REQUEST,
          });
        }

        // TODO add where values (publicKey)
      }
    } else {
      if(!FIOSDK.isFioPublicKeyValid(publicKey)) {
        return generateErrorResponse(this.res, {
          error: 'Invalid public key',
          errorCode: PUB_API_ERROR_CODES.NO_PUBLIC_KEY_SPECIFIED,
          statusCode: HTTP_CODES.BAD_REQUEST,
        });
      }

      // TODO add where values (publicKey, referralCode)
    }

    const result = [];

    return generateSummaryResponse(result);
  }

  static get validationRules() {
    return {
      publicKey: 'string',
      referralCode: 'string',
      externId: 'string',
      address: 'string',
      domain: 'string',
      type: 'string',
      accountPayId: 'integer',
    };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return [];
  }
}
