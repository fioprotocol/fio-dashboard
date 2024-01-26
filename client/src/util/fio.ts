import { TextDecoder, TextEncoder } from 'text-encoding';
import { Transactions as FioTransactionsProvider } from '@fioprotocol/fiosdk/lib/transactions/Transactions';
import { PublicAddress } from '@fioprotocol/fiosdk/src/entities/PublicAddress';
import { Api as ChainApi, Numeric as ChainNumeric } from '@fioprotocol/fiojs';
import { allRules, validate } from '@fioprotocol/fiosdk/lib/utils/validation';

import {
  AbiProvider,
  BinaryAbi,
} from '@fioprotocol/fiojs/dist/chain-api-interfaces';

import apis from '../api';
import { AdminDomain } from '../api/responses';
import { setFioName } from '../utils';
import { convertToNewDate, log } from '../util/general';

import { NON_VAILD_DOMAIN } from '../constants/errors';
import {
  DOMAIN_EXPIRED_DAYS,
  DOMAIN_TYPE,
  FIO_REQUEST_STATUS_TYPES,
} from '../constants/fio';
import { ANALYTICS_EVENT_ACTIONS, CHAIN_CODES } from '../constants/common';
import {
  DOMAIN_EXP_DEBUG_AFFIX,
  DOMAIN_EXP_IN_30_DAYS,
} from '../constants/regExps';
import { FIO_ADDRESS_DELIMITER } from '../utils';

import {
  NftTokenResponse,
  NFTTokenDoublet,
  Prices,
  PublicAddressDoublet,
  IncomePrices,
  CartItem,
} from '../types';
import { RawTransaction } from '../api/fio';
import { ActionDataParams, FioServerResponse } from '../types/fio';

export const vaildateFioDomain = (domain: string) => {
  if (!domain) {
    return 'Domain Field Should Be Filled';
  }

  if (domain && domain.length > 62) {
    return 'Domain name should be less than 62 characters';
  }

  const domainValidation = validate(
    { fioDomain: domain },
    { fioDomain: allRules.fioDomain },
  );

  if (!domainValidation.isValid) {
    return NON_VAILD_DOMAIN;
  }

  return null;
};

export const validateFioAddress = (address: string, domain: string) => {
  if (!address) {
    return 'FIO Handle Field Should Be Filled';
  }

  if (!domain) {
    return 'Missing domain';
  }

  if (address && domain && address.length + domain.length > 63) {
    return 'FIO Handle should be less than 63 characters';
  }

  const addressValidation = validate(
    { fioAddress: `${address}${FIO_ADDRESS_DELIMITER}${domain}` },
    { fioAddress: allRules.fioAddress },
  );

  if (!addressValidation.isValid) {
    return 'FIO Handle only allows letters, numbers and dash in the middle';
  }

  vaildateFioDomain(domain);

  return null;
};

export const checkAddressOrDomainIsExist = async ({
  address,
  domain,
  fireAnalytics,
}: {
  address?: string;
  domain: string;
  fireAnalytics: (eventName: string) => void;
}) => {
  if (domain) {
    try {
      fireAnalytics(ANALYTICS_EVENT_ACTIONS.SEARCH_ITEM);
      const isAvail = await apis.fio.availCheck(setFioName(address, domain));
      return isAvail && isAvail.is_registered === 1;
    } catch (e) {
      //
    }
  }
};

export const transformNft = (nfts: NftTokenResponse[]): NFTTokenDoublet[] => {
  const nftList = [];
  for (const item of nfts) {
    const nftItem = {
      fioAddress: item.fio_address,
      contractAddress: item.contract_address,
      chainCode: item.chain_code,
      tokenId: item.token_id,
      url: item.url,
      hash: item.hash,
      metadata: item.metadata,
    };
    nftList.push(nftItem);
  }
  return nftList;
};

export const fioAddressToPubKey = async (
  fioAddress: string,
): Promise<string> => {
  let isFioAddress = false;
  let pubKey = '';
  try {
    apis.fio.isFioAddressValid(fioAddress);
    isFioAddress = true;
  } catch (e) {
    //
  }

  if (isFioAddress) {
    try {
      const {
        public_address: publicAddress,
      } = await apis.fio.getFioPublicAddress(fioAddress);
      pubKey = publicAddress;
    } catch (e) {
      //
    }
  }

  return pubKey;
};

export const genericTokenId = (
  chainCode: string,
  tokenId: string,
  contractAddress: string,
): string => `${chainCode}-${tokenId}-${contractAddress}`;

export const transformPublicAddresses = (
  publicAddresses: PublicAddressDoublet[],
): PublicAddress[] =>
  publicAddresses.map(publicAddressObj => {
    const { chainCode, tokenCode, publicAddress } = publicAddressObj;

    return {
      chain_code: chainCode,
      token_code: tokenCode,
      public_address: publicAddress,
    };
  });

export const normalizePublicAddresses = (
  publicAddresses: PublicAddressDoublet[],
): PublicAddressDoublet[] =>
  publicAddresses.map(({ chainCode, tokenCode, publicAddress }) => ({
    chainCode,
    tokenCode,
    publicAddress,
  }));

export const statusBadgeColours = (
  status: string,
): {
  isBlue: boolean;
  isOrange: boolean;
  isRose: boolean;
  isYellowGreen: boolean;
} => ({
  isBlue: FIO_REQUEST_STATUS_TYPES.PAID === status,
  isOrange: FIO_REQUEST_STATUS_TYPES.REJECTED === status,
  isRose: FIO_REQUEST_STATUS_TYPES.PENDING === status,
  isYellowGreen: FIO_REQUEST_STATUS_TYPES.CANCELED === status,
});

export const isFioChain = (chain: string): boolean => chain === CHAIN_CODES.FIO;

export const convertPrices = (prices: IncomePrices): { pricing: Prices } => {
  const pricing = {
    ...prices.pricing,
    fio: { address: 0, domain: 0 },
    usdt: { address: 0, domain: 0 },
  };

  pricing.fio = {
    address: apis.fio.sufToAmount(pricing.nativeFio.address) || 0,
    domain: apis.fio.sufToAmount(pricing.nativeFio.domain) || 0,
  };

  pricing.usdt = {
    address: apis.fio.convertFioToUsdc(
      pricing.nativeFio.address,
      pricing.usdtRoe,
    ),
    domain: apis.fio.convertFioToUsdc(
      pricing.nativeFio.domain,
      pricing.usdtRoe,
    ),
  };
  return { pricing };
};

export const serializeTransaction = async (
  tx: RawTransaction,
): Promise<string> => {
  try {
    const abiProvider: AbiProvider = {
      getRawAbi: async (accountName: string) => {
        const rawAbi = FioTransactionsProvider.abiMap.get(accountName);
        if (!rawAbi) {
          throw new Error(`Missing ABI for account ${accountName}`);
        }
        const abi = ChainNumeric.base64ToBinary(rawAbi.abi);
        const binaryAbi: BinaryAbi = { accountName: rawAbi.account_name, abi };
        return binaryAbi;
      },
    };
    const chainApi = new ChainApi({
      signatureProvider: null,
      authorityProvider: null,
      abiProvider,
      chainId: null,
      textDecoder: new TextDecoder(),
      textEncoder: new TextEncoder(),
    });
    const serTx = {
      ...tx,
      context_free_actions: await chainApi.serializeActions(
        tx.context_free_actions || [],
      ),
      actions: await chainApi.serializeActions(tx.actions),
    };

    return Buffer.from(chainApi.serializeTransaction(serTx)).toString('hex');
  } catch (e) {
    log.error(e);
  }

  return '';
};

export const transformNonPremiumDomains = (domains: Partial<AdminDomain>[]) =>
  domains
    .filter(domain => !domain.isPremium)
    .map(domain => ({
      name: domain.name,
      domainType: DOMAIN_TYPE.ALLOW_FREE,
      rank: domain.rank || 0,
      isFirstRegFree: domain?.isFirstRegFree,
    }));

export const transformPremiumDomains = (domains: Partial<AdminDomain>[]) =>
  domains
    .filter(domain => domain.isPremium)
    .map(domain => ({
      name: domain.name,
      domainType: DOMAIN_TYPE.PREMIUM,
      rank: domain.rank || 0,
    }));

export const transformCustomDomains = (
  domains: { username?: string; name?: string; rank: number }[],
  swapAddressAndDomainPlaces?: boolean,
) =>
  domains.map(customDomain => {
    const { username = '', name = '' } = customDomain;

    return {
      name: username || name,
      domainType: DOMAIN_TYPE.CUSTOM,
      rank: customDomain.rank,
      swapAddressAndDomainPlaces,
    };
  });

export const isDomainExpired = (
  domainName: string,
  expiration: number | string,
): boolean => {
  if (
    process.env.REACT_APP_IS_EXPIRE_DOMAINS_TEST_MODE === 'true' &&
    DOMAIN_EXP_DEBUG_AFFIX.test(domainName) &&
    !DOMAIN_EXP_IN_30_DAYS.test(domainName)
  ) {
    return true;
  }

  const today = new Date();

  const expirationDay = new Date(convertToNewDate(expiration));

  expirationDay.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return expirationDay <= today;
};

export const isDomainWillExpireIn30Days = (
  domainName: string,
  expiration: number | string,
): boolean => {
  if (
    process.env.REACT_APP_IS_EXPIRE_DOMAINS_TEST_MODE === 'true' &&
    DOMAIN_EXP_DEBUG_AFFIX.test(domainName) &&
    DOMAIN_EXP_IN_30_DAYS.test(domainName)
  ) {
    return true;
  }

  const today = new Date();

  const expirationDay = new Date(convertToNewDate(expiration));

  expirationDay.setDate(expirationDay.getDate() - DOMAIN_EXPIRED_DAYS);

  expirationDay.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return expirationDay <= today;
};

export const checkIsDomainItemExistsOnCart = (
  id: string,
  cartItem: CartItem,
): boolean =>
  cartItem.id === id ||
  (cartItem.domainType === DOMAIN_TYPE.CUSTOM && cartItem.domain === id);

export const handleFioServerResponse = (
  response: FioServerResponse,
): {
  status: string;
  fee_collected?: number;
  fio_request_id?: number;
  oracle_fee_collected?: number;
} => {
  const serverResponse =
    response.processed?.action_traces[0]?.receipt?.response;
  try {
    const parsedResponse: {
      status: string;
      fee_collected?: number;
    } = serverResponse ? JSON.parse(serverResponse) : {};

    return parsedResponse;
  } catch (error) {
    log.error(error);
  }
};

export const handleFioServerResponseActionData = (
  response: FioServerResponse,
): ActionDataParams => {
  return response?.processed?.action_traces[0]?.act?.data;
};
