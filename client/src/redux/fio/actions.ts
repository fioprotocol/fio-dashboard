import { EndPoint, FioAddress } from '@fioprotocol/fiosdk';

import { Api } from '../../api';

import { ENDPOINT_FEE_HASH } from '../../api/fio';

import { FullEndPoint } from '../../constants/fio';

import {
  PublicAddressDoublet,
  FeePrice,
  OracleFees,
  WalletsBalances,
  FioActionExecuted,
} from '../../types';
import { CommonAction, CommonPromiseAction } from '../types';

export const prefix = 'fio';

export const REFRESH_BALANCE_REQUEST = `${prefix}/REFRESH_BALANCE_REQUEST`;
export const REFRESH_BALANCE_SUCCESS = `${prefix}/REFRESH_BALANCE_SUCCESS`;
export const REFRESH_BALANCE_FAILURE = `${prefix}/REFRESH_BALANCE_FAILURE`;

export const refreshBalance = (publicKey: string): CommonPromiseAction => ({
  types: [
    REFRESH_BALANCE_REQUEST,
    REFRESH_BALANCE_SUCCESS,
    REFRESH_BALANCE_FAILURE,
  ],
  promise: (api: Api) => api.fio.getBalance(publicKey),
  publicKey,
});
export const SET_BALANCES = `${prefix}/SET_BALANCES`;

export const setBalances = (balances: WalletsBalances): CommonAction => ({
  type: SET_BALANCES,
  data: balances,
});

export const REFRESH_FIO_NAMES_REQUEST = `${prefix}/REFRESH_FIO_NAMES_REQUEST`;
export const REFRESH_FIO_NAMES_SUCCESS = `${prefix}/REFRESH_FIO_NAMES_SUCCESS`;
export const REFRESH_FIO_NAMES_FAILURE = `${prefix}/REFRESH_FIO_NAMES_FAILURE`;

export const refreshFioNames = (publicKey: string): CommonPromiseAction => ({
  types: [
    REFRESH_FIO_NAMES_REQUEST,
    REFRESH_FIO_NAMES_SUCCESS,
    REFRESH_FIO_NAMES_FAILURE,
  ],
  promise: (api: Api) => api.fio.getFioNames(publicKey),
  publicKey,
});

export const RESET_FIO_NAMES = `${prefix}/RESET_FIO_NAMES`;

export const resetFioNames = (): CommonAction => ({
  type: RESET_FIO_NAMES,
});

export const GET_ORACLE_FEES_REQUEST = `${prefix}/GET_ORACLE_FEES_REQUEST`;
export const GET_ORACLE_FEES_SUCCESS = `${prefix}/GET_ORACLE_FEES_SUCCESS`;
export const GET_ORACLE_FEES_FAILURE = `${prefix}/GET_ORACLE_FEES_FAILURE`;
export const SET_ORACLE_FEES = `${prefix}/SET_ORACLE_FEES`;

export const getOracleFees = (): CommonPromiseAction => ({
  types: [
    GET_ORACLE_FEES_REQUEST,
    GET_ORACLE_FEES_SUCCESS,
    GET_ORACLE_FEES_FAILURE,
  ],
  promise: (api: Api) => api.fio.getOracleFees(),
});

export const setOracleFees = (fees: OracleFees): CommonAction => ({
  type: SET_ORACLE_FEES,
  data: fees,
});

export const GET_FEE_REQUEST = `${prefix}/GET_FEE_REQUEST`;
export const GET_FEE_SUCCESS = `${prefix}/GET_FEE_SUCCESS`;
export const GET_FEE_FAILURE = `${prefix}/GET_FEE_FAILURE`;
export const SET_FEE = `${prefix}/SET_FEE`;

export const getFee = (
  endpoint: FullEndPoint,
  fioAddress: string = '',
): CommonPromiseAction => ({
  types: [GET_FEE_REQUEST, GET_FEE_SUCCESS, GET_FEE_FAILURE],
  promise: (api: Api) => {
    // temporary solution for staking fee value
    if (
      [EndPoint.stakeFioTokens, EndPoint.unStakeFioTokens].includes(
        endpoint as EndPoint,
      )
    ) {
      return api.fio.getFeeFromTable(ENDPOINT_FEE_HASH[endpoint]);
    }
    return api.fio.getFee(endpoint as EndPoint, fioAddress);
  },
  endpoint,
});

export const setFees = (fees: {
  [endpoint: string]: FeePrice;
}): CommonAction => ({
  type: SET_FEE,
  data: fees,
});

export const GET_FIO_ADDRESSES_REQUEST = `${prefix}/GET_FIO_ADDRESSES_REQUEST`;
export const GET_FIO_ADDRESSES_SUCCESS = `${prefix}/GET_FIO_ADDRESSES_SUCCESS`;
export const GET_FIO_ADDRESSES_FAILURE = `${prefix}/GET_FIO_ADDRESSES_FAILURE`;

export const getFioAddresses = (
  publicKey: string,
  limit: number,
  offset: number,
): CommonPromiseAction => ({
  types: [
    GET_FIO_ADDRESSES_REQUEST,
    GET_FIO_ADDRESSES_SUCCESS,
    GET_FIO_ADDRESSES_FAILURE,
  ],
  promise: (api: Api) => api.fio.getFioAddresses(publicKey, limit, offset),
  publicKey,
});

export const GET_WALLETS_FIO_ADDRESSES_REQUEST = `${prefix}/GET_WALLETS_FIO_ADDRESSES_REQUEST`;
export const GET_WALLETS_FIO_ADDRESSES_SUCCESS = `${prefix}/GET_WALLETS_FIO_ADDRESSES_SUCCESS`;
export const GET_WALLETS_FIO_ADDRESSES_FAILURE = `${prefix}/GET_WALLETS_FIO_ADDRESSES_FAILURE`;

export const getWalletsFioAddresses = (
  publicKeys: string[],
): CommonPromiseAction => ({
  types: [
    GET_WALLETS_FIO_ADDRESSES_REQUEST,
    GET_WALLETS_FIO_ADDRESSES_SUCCESS,
    GET_WALLETS_FIO_ADDRESSES_FAILURE,
  ],
  promise: async (api: Api) => {
    let list: FioAddress[] = [];
    const responses = await Promise.allSettled(
      publicKeys.map((publicKey: string) =>
        api.fio
          .getFioAddresses(publicKey, 0, 0)
          .then(({ fio_addresses }) =>
            fio_addresses.map(item => ({ ...item, publicKey })),
          ),
      ),
    );
    for (const response of responses) {
      if (response.status === 'fulfilled') list = [...list, ...response.value];
    }

    return { fio_addresses: list };
  },
});

export const GET_FIO_DOMAINS_REQUEST = `${prefix}/GET_FIO_DOMAINS_REQUEST`;
export const GET_FIO_DOMAINS_SUCCESS = `${prefix}/GET_FIO_DOMAINS_SUCCESS`;
export const GET_FIO_DOMAINS_FAILURE = `${prefix}/GET_FIO_DOMAINS_FAILURE`;

export const getFioDomains = (
  publicKey: string,
  limit: number,
  offset: number,
): CommonPromiseAction => ({
  types: [
    GET_FIO_DOMAINS_REQUEST,
    GET_FIO_DOMAINS_SUCCESS,
    GET_FIO_DOMAINS_FAILURE,
  ],
  promise: (api: Api) => api.fio.getFioDomains(publicKey, limit, offset),
  publicKey,
});

export const GET_FIO_PUBLIC_ADDRESS_REQUEST = `${prefix}/GET_FIO_PUBLIC_ADDRESS_REQUEST`;
export const GET_FIO_PUBLIC_ADDRESS_SUCCESS = `${prefix}/GET_FIO_PUBLIC_ADDRESS_SUCCESS`;
export const GET_FIO_PUBLIC_ADDRESS_FAILURE = `${prefix}/GET_FIO_PUBLIC_ADDRESS_FAILURE`;

export const getFioPubAddress = (fioAddress: string): CommonPromiseAction => ({
  types: [
    GET_FIO_PUBLIC_ADDRESS_REQUEST,
    GET_FIO_PUBLIC_ADDRESS_SUCCESS,
    GET_FIO_PUBLIC_ADDRESS_FAILURE,
  ],
  promise: (api: Api) => api.fio.getFioPublicAddress(fioAddress),
});

export const GET_ALL_PUBLIC_ADDRESS_REQUEST = `${prefix}/GET_ALL_PUBLIC_ADDRESS_REQUEST`;
export const GET_ALL_PUBLIC_ADDRESS_SUCCESS = `${prefix}/GET_ALL_PUBLIC_ADDRESS_SUCCESS`;
export const GET_ALL_PUBLIC_ADDRESS_FAILURE = `${prefix}/GET_ALL_PUBLIC_ADDRESS_FAILURE`;

export const getAllFioPubAddresses = (
  fioAddress: string,
  limit: number,
  offset: number,
): CommonPromiseAction => ({
  types: [
    GET_ALL_PUBLIC_ADDRESS_REQUEST,
    GET_ALL_PUBLIC_ADDRESS_SUCCESS,
    GET_ALL_PUBLIC_ADDRESS_FAILURE,
  ],
  promise: (api: Api) => api.fio.getPublicAddresses(fioAddress, limit, offset),
  fioAddress,
});

export const FIO_SIGNATURE_REQUEST = `${prefix}/FIO_SIGNATURE_REQUEST`;
export const FIO_SIGNATURE_SUCCESS = `${prefix}/FIO_SIGNATURE_SUCCESS`;
export const FIO_SIGNATURE_FAILURE = `${prefix}/FIO_SIGNATURE_FAILURE`;
export const FIO_SIGN_NFT_REQUEST = `${prefix}/FIO_SIGN_NFT_REQUEST`;
export const FIO_SIGN_NFT_SUCCESS = `${prefix}/FIO_SIGN_NFT_SUCCESS`;
export const FIO_SIGN_NFT_FAILURE = `${prefix}/FIO_SIGN_NFT_FAILURE`;

export const getNFTSignatures = (searchParams: {
  fioAddress?: string;
  chainCode?: string;
  hash?: string;
  tokenId?: string;
  contractAddress?: string;
}): CommonPromiseAction => ({
  types: [FIO_SIGNATURE_REQUEST, FIO_SIGNATURE_SUCCESS, FIO_SIGNATURE_FAILURE],
  promise: (api: Api) => {
    return api.fio.getNFTs(searchParams);
  },
  searchParams,
});

export const CLEAR_NFT_SIGNATURES = `${prefix}/CLEAR_NFT_SIGNATURES`;

export const clearNFTSignatures = (): CommonAction => ({
  type: CLEAR_NFT_SIGNATURES,
});

export const TOGGLE_TOKEN_LIST_INFO_BADGE = `${prefix}/TOGGLE_TOKEN_LIST_INFO_BADGE`;

export const toggleTokenListInfoBadge = (enabled: boolean): CommonAction => ({
  type: TOGGLE_TOKEN_LIST_INFO_BADGE,
  enabled,
});

export const TOGGLE_FCH_BUNDLE_WARNING_BADGE = `${prefix}/TOGGLE_FCH_BUNDLE_WARNING_BADGE`;

export const toggleFchBundleWarningBadge = (
  enabled: boolean,
): CommonAction => ({
  type: TOGGLE_FCH_BUNDLE_WARNING_BADGE,
  enabled,
});

export const TOGGLE_EXPIRED_DOMAIN_WARNING_BADGE = `${prefix}/TOGGLE_EXPIRED_DOMAIN_WARNING_BADGE`;

export const toggleExpiredDomainBadge = (enabled: boolean): CommonAction => ({
  type: TOGGLE_EXPIRED_DOMAIN_WARNING_BADGE,
  enabled,
});

export const TOGGLE_EXPIRED_DOMAIN_WARNING_FCH_BADGE = `${prefix}/TOGGLE_EXPIRED_DOMAIN_WARNING_FCH_BADGE`;

export const toggleExpiredDomainFchBadge = (
  enabled: boolean,
): CommonAction => ({
  type: TOGGLE_EXPIRED_DOMAIN_WARNING_FCH_BADGE,
  enabled,
});

export const TOGGLE_SOCIAL_MEDIA_LIST_INFO_BADGE = `${prefix}/TOGGLE_SOCIAL_MEDIA_LIST_INFO_BADGE`;

export const toggleSocialMediaListInfoBadge = (
  enabled: boolean,
): CommonAction => ({
  type: TOGGLE_SOCIAL_MEDIA_LIST_INFO_BADGE,
  enabled,
});

export const UPDATE_PUBLIC_ADDRESSES = `${prefix}/UPDATE_PUBLIC_ADDRESSES`;

export const updatePublicAddresses = (
  fioAddress: string,
  updPublicAddresses: {
    addPublicAddresses: PublicAddressDoublet[];
    deletePublicAddresses: PublicAddressDoublet[];
  },
): CommonAction => ({
  type: UPDATE_PUBLIC_ADDRESSES,
  fioAddress,
  updPublicAddresses,
});

export const FIO_ACTION_EXECUTE_SUCCESS = `${prefix}/FIO_ACTION_EXECUTE_SUCCESS`;

export const fioActionExecuted = (data: FioActionExecuted): CommonAction => ({
  type: FIO_ACTION_EXECUTE_SUCCESS,
  data,
});

export const TRANSACTION_RESULTS_CLOSE = `${prefix}/TRANSACTION_RESULTS_CLOSE`;

export const onTxResultsClose = (): CommonAction => ({
  type: TRANSACTION_RESULTS_CLOSE,
});

export const RESET_MAPPED_PUB_ADDRESS_ERROR = `${prefix}/RESET_MAPPED_PUB_ADDRESS_ERROR`;

export const resetMappedPubAddressError = (): CommonAction => ({
  type: RESET_MAPPED_PUB_ADDRESS_ERROR,
});
