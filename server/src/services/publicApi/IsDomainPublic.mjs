import { FIOSDK } from '@fioprotocol/fiosdk';

import Base from '../Base';
import {
  formatChainDomain,
  generateErrorResponse,
  generateSuccessResponse,
} from '../../utils/publicApi.mjs';
import { PUB_API_ERROR_CODES } from '../../constants/pubApiErrorCodes.mjs';
import { HTTP_CODES } from '../../constants/general.mjs';
import { fioApi } from '../../external/fio.mjs';

export default class IsDomainPublic extends Base {
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

  async processing({ domain }) {
    if (!FIOSDK.isFioDomainValid(domain)) {
      return generateErrorResponse(this.res, {
        error: `Invalid domain`,
        errorCode: PUB_API_ERROR_CODES.INVALID_FIO_NAME,
        statusCode: HTTP_CODES.BAD_REQUEST,
      });
    }

    const domainFromChain = await fioApi.getFioDomain(domain).then(formatChainDomain);

    if (!domainFromChain) {
      return generateErrorResponse(this.res, {
        error: 'Domain is not registered',
        errorCode: PUB_API_ERROR_CODES.DOMAIN_NOT_FOUND,
        statusCode: HTTP_CODES.NOT_FOUND,
      });
    }

    return generateSuccessResponse(this.res, {
      isPublic: domainFromChain.isPublic,
    });
  }

  static get validationRules() {
    return { domain: ['required', 'string'] };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return [];
  }
}
