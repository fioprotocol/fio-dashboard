import Base from '../Base';
import { formatChainDomain, generateResponse } from '../../utils/publicApi.mjs';
import { PUB_API_ERROR_CODES } from '../../constants/pubApiErrorCodes.mjs';
import { ReferrerProfile } from '../../models/index.mjs';
import { FIOSDK } from '@fioprotocol/fiosdk';
import { fioApi } from '../../external/fio.mjs';
import { getROE } from '../../external/roe.mjs';

export default class Renew extends Base {
  async execute(args) {
    try {
      return await this.processing(args)
    } catch (e) {
      return generateResponse({
        error: `Server error. Please try later.`,
        errorCode: PUB_API_ERROR_CODES.SERVER_ERROR
      });
    }
  }

  async processing({ apiToken, address, referralCode, publicKey }) {
    if (!referralCode) {
      // TODO add new ENV variable or replace another value
      referralCode = process.env.DEFAULT_REFERRAL_CODE;
    }

    const refProfile = await ReferrerProfile.findOne({
      where: {
        type: ReferrerProfile.TYPE.REF,
        code: referralCode,
      }
    });

    if (!refProfile) {
      return generateResponse({
        error: 'Referral code not found',
        errorCode: PUB_API_ERROR_CODES.REF_NOT_FOUND,
      });
    }

    let fioAddress = null;
    let fioDomain = null;

    if (address.includes('@')) {
      const [handle, domain] = address.split('@');
      fioAddress = handle;
      fioDomain = domain;
    } else {
      fioDomain = address;
    }

    const type = fioAddress ? 'account' : 'domain';

    if (
      (fioAddress && !FIOSDK.isFioAddressValid(fioAddress))
      || !FIOSDK.isFioDomainValid(fioDomain)
    ) {
      return generateResponse({
        error: `Invalid ${type}`,
        errorCode: PUB_API_ERROR_CODES.INVALID_FIO_NAME
      });
    }

    if (!FIOSDK.isFioPublicKeyValid(publicKey)) {
      return generateResponse({
        error: 'Missing public key',
        errorCode: PUB_API_ERROR_CODES.NO_PUBLIC_KEY_SPECIFIED
      });
    }

    if (type === 'account') {
      const domainFromChain = await fioApi.getFioDomain(fioDomain);
      const domain = formatChainDomain(domainFromChain);
      if (!domain || domain.account !== 'fio.oracle') {
        return generateResponse({
          error: 'Missing public key',
          errorCode: PUB_API_ERROR_CODES.NO_PUBLIC_KEY_SPECIFIED
        });
      }
    }

    if (!await fioApi.isAccountCouldBeRenewed(address)) {
      return generateResponse({
        error: `${type} not registered`,
        errorCode: PUB_API_ERROR_CODES.ADDRESS_CANT_BE_RENEWED,
      });
    }

    const roe = await getROE();
    const prices = await fioApi.getPrices(true);
    const price = fioApi.convertFioToUsdc(
      type === 'account' ? prices.addBundles : prices.renewDomain,
      roe,
    );

    // TODO
  }

  static get validationRules() {
    return {
      address: ['required', 'string'],
      referralCode: 'string',
      publicKey: 'string',
    };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return [];
  }
}
