import {
  PublicAddress,
  allRules,
  validate,
  RawRequest,
  FioRequestStatus,
  Action,
} from '@fioprotocol/fiosdk';

import apis from '../api';
import { AdminDomain } from '../api/responses';
import { setFioName } from '../utils';
import { convertToNewDate, log } from './general';
import MathOp from './math';

import { NON_VAILD_DOMAIN } from '../constants/errors';
import {
  DashboardAction,
  DOMAIN_EXPIRED_DAYS,
  DOMAIN_TYPE,
  getAccountByDashboardAction,
  getActionByDashboardAction,
  TOO_LONG_DOMAIN_RENEWAL_YEAR,
} from '../constants/fio';

import { ANALYTICS_EVENT_ACTIONS, CHAIN_CODES } from '../constants/common';
import {
  DOMAIN_EXP_DEBUG_AFFIX,
  DOMAIN_EXP_IN_30_DAYS,
  DOMAIN_HAS_TOO_LONG_RENEWAL_PERIOD,
} from '../constants/regExps';
import { FIO_ADDRESS_DELIMITER } from '../utils';

import config from '../config';

import {
  NftTokenResponse,
  NFTTokenDoublet,
  PublicAddressDoublet,
  AnyObject,
  CartItem,
} from '../types';
import { ActionDataParams, FioServerResponse } from '../types/fio';

export const validateFioDomain = (domain: string): string | null => {
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

export const validateFioAddress = (
  address: string,
  domain: string,
): string | null => {
  if (!address) {
    return 'FIO Handle Field Should Be Filled';
  }

  if (!domain) {
    return 'Missing domain';
  }

  if (
    address &&
    domain &&
    (address.length + domain.length > 63 || address.length > 36)
  ) {
    return 'FIO Handle should be less than 63 characters and username cannot be longer than 36 characters.';
  }

  const addressValidation = validate(
    { fioAddress: `${address}${FIO_ADDRESS_DELIMITER}${domain}` },
    { fioAddress: allRules.fioAddress },
  );

  if (!addressValidation.isValid) {
    return 'FIO Handle only allows letters, numbers and dash in the middle';
  }

  validateFioDomain(domain);

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
  let pubKey = '';

  if (apis.fio.publicFioSDK.validateFioAddress(fioAddress)) {
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
  isBlue: FioRequestStatus.sentToBlockchain === status,
  isOrange: FioRequestStatus.rejected === status,
  isRose: FioRequestStatus.requested === status,
  isYellowGreen: FioRequestStatus.canceled === status,
});

export const isFioChain = (chain: string): boolean => chain === CHAIN_CODES.FIO;

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
    config.testingFlags.domainExpiration === 'true' &&
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
    config.testingFlags.domainExpiration === 'true' &&
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

export const isDomainHasTooLongRenewalPeriod = ({
  domainName,
  expiration,
  period,
}: {
  domainName: string;
  expiration: number | string;
  period: number;
}): boolean => {
  if (
    config.testingFlags.domainExpiration === 'true' &&
    DOMAIN_HAS_TOO_LONG_RENEWAL_PERIOD.test(domainName)
  ) {
    return true;
  }

  // Create max year date (January 1st of the max year)
  const maxRenewalDate = new Date(TOO_LONG_DOMAIN_RENEWAL_YEAR, 0, 1);

  // Convert expiration timestamp to Date and add the period (years)
  const expirationDate =
    expiration !== null ? new Date(convertToNewDate(expiration)) : new Date();

  const renewalEndDate = new Date(expirationDate);
  renewalEndDate.setFullYear(renewalEndDate.getFullYear() + period);

  // Reset time components for consistent comparison
  renewalEndDate.setHours(0, 0, 0, 0);
  maxRenewalDate.setHours(0, 0, 0, 0);

  return renewalEndDate >= maxRenewalDate;
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
  fee_collected?: string;
  fio_request_id?: number;
  oracle_fee_collected?: string;
} => {
  const serverResponse =
    response.processed?.action_traces[0]?.receipt?.response;
  try {
    const parsedResponse: {
      status: string;
      fee_collected?: number;
      oracle_fee_collected?: number;
    } = serverResponse ? JSON.parse(serverResponse) : {};

    return {
      ...parsedResponse,
      fee_collected: parsedResponse.fee_collected
        ? new MathOp(parsedResponse.fee_collected).toString()
        : undefined,
      oracle_fee_collected: parsedResponse.oracle_fee_collected
        ? new MathOp(parsedResponse.oracle_fee_collected).toString()
        : undefined,
    };
  } catch (error) {
    log.error(error);
  }
};

export const handleFioServerResponseActionData = (
  response: FioServerResponse,
): ActionDataParams => {
  return response?.processed?.action_traces[0]?.act?.data;
};

export const prepareChainTransaction = async (
  walletPublicKey: string,
  action: DashboardAction,
  data: AnyObject,
): Promise<{ chainId: string; transaction: RawRequest }> => {
  const validApiUrls = await apis.fio.checkUrls();
  apis.fio.publicFioSDK.setApiUrls(validApiUrls);
  const chainData = await apis.fio.publicFioSDK.transactions.getChainDataForTx();
  const transaction = await apis.fio.publicFioSDK.transactions.createRawTransaction(
    {
      account: getAccountByDashboardAction(action),
      action: getActionByDashboardAction(action) as Action,
      data: data,
      publicKey: walletPublicKey,
      chainData,
    },
  );

  return {
    chainId: chainData.chain_id,
    transaction,
  };
};

export const getDomainExpiration = async (
  domainName: string,
): Promise<number | null> => {
  try {
    const { expiration } = (await apis.fio.getFioDomain(domainName)) || {};

    return expiration || null;
  } catch (err) {
    log.error(err);
  }
};

export const checkIsDomainExpired = async (
  domainName: string,
): Promise<boolean> => {
  if (!domainName) return null;

  const expiration = await getDomainExpiration(domainName);

  return expiration && isDomainExpired(domainName, expiration);
};

export const checkIsTooLongDomainRenewal = async ({
  domainName,
  period,
}: {
  domainName: string;
  period: number;
}): Promise<boolean> => {
  const expiration = await getDomainExpiration(domainName);
  return isDomainHasTooLongRenewalPeriod({ domainName, expiration, period });
};

export const normalizeFioHandle = (fioHandle: string): string => {
  if (!fioHandle) return null;

  // Using 'let' to allow for future FIO Handle normalization rules
  let normalizedFioHandle = fioHandle;

  normalizedFioHandle = normalizedFioHandle.toLowerCase();

  return normalizedFioHandle;
};

export const renderFioPriceFromSuf = (price: string | number): string =>
  new MathOp(apis.fio.sufToAmount(price)).round(2, 1).toString();
