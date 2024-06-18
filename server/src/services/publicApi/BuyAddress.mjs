import Base from '../Base';
import {
  FreeAddress, Order, OrderItem,
  ReferrerProfile,
} from '../../models';
import { formatChainDomain, generateSummaryResponse, generateResponse } from '../../utils/publicApi';
import { PUB_API_ERROR_CODES } from '../../constants/pubApiErrorCodes';
import { FIOSDK } from '@fioprotocol/fiosdk';
import { fioApi } from '../../external/fio';
import { getROE } from '../../external/roe';

export default class BuyAddress extends Base {
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

    const refDomains = refProfile.settings && refProfile.settings.domains && Array.isArray(refProfile.settings.domains) ? refProfile.settings.domains : [];
    const refDomain = refDomains.find(({name}) => name === fioDomain);

    if (type === 'account') {
      if (!refDomain) {
        const domainFromChain = await fioApi.getFioDomain(fioDomain);
        const domain = formatChainDomain(domainFromChain);

        if (!domain) {
          return generateResponse({
            error: 'Domain is not registered',
            errorCode: PUB_API_ERROR_CODES.DOMAIN_IS_NOT_REGISTERED
          });
        }
        if (!domain.isPublic) {
          return generateResponse({
            error: 'Domain is not public',
            errorCode: PUB_API_ERROR_CODES.DOMAIN_IS_NOT_PUBLIC
          });
        }
      }
    }

    if (type === 'account') {
      // TODO check address or fioAddress
      const addressFromChain = await fioApi.getFioAddress(address);
      if (addressFromChain) {
        return generateResponse({
          error: 'Already registered',
          errorCode: PUB_API_ERROR_CODES.ADDRESS_IS_ALREADY_REGISTERED
        });
      }
    }

    if (!apiToken) {
      return generateResponse({
        error: 'Sale Closed. Please try back soon…',
        errorCode: PUB_API_ERROR_CODES.SALE_IS_CLOSED
      });
    }

    if (refProfile.apiToken !== apiToken) {
      return generateResponse({
        error: 'Unauthorized: Due to the referral code sale price, a user API Token is required',
        errorCode: PUB_API_ERROR_CODES.SALE_IS_CLOSED
      });
    }

    const isFirstRegFree = refDomain !== undefined ? refDomain.isFirstRegFree : false;

    if (type === 'account' && isFirstRegFree) {
      const freeAddress = await FreeAddress.findOneWhere({ name: address, publicKey })
      if (freeAddress) {
        return generateResponse({
          error: `You have already registered a free FIO Crypto Handle for that domain`,
          errorCode: PUB_API_ERROR_CODES.ONE_FREE_ADDRESS_PER_DOMAIN_ERROR
        })
      }

      const order = await Order.findOne({
        where: {
          publicKey,
          refProfileId: refProfile.id,
        },
        include: [OrderItem],
      });

      const registeringAccount = order.OrderItems.find(
        ({address, domain}) => address === fioAddress && domain === fioDomain
      );

      if (registeringAccount) {
        return generateResponse({
          error: `You have already sent a request to register a free FIO Crypto Handle for that domain`,
          errorCode: PUB_API_ERROR_CODES.ALREADY_SENT_REGISTRATION_REQ_FOR_DOMAIN
        });
      }
    }

    const roe = await getROE();
    const prices = await fioApi.getPrices(true);
    const price = fioApi.convertFioToUsdc(
      type === 'account' ? prices.combo : prices.domain,
      roe,
    );

    const result = [];

    return generateResponse(result);
  }

  static get validationRules() {
    return {
      apiToken: ['string'],
      address: ['required', 'string'],
      referralCode: 'string',
      publicKey: ['required', 'string'],
    };
  }

  static get paramsSecret() {
    return [];
  }

  static get resultSecret() {
    return [];
  }
}
