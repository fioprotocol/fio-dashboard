import { Api } from '../../api';
import { PublicAddressDoublet, FeePrice, WalletsBalances } from '../../types';
export const prefix = 'fio';

export const REFRESH_BALANCE_REQUEST = `${prefix}/REFRESH_BALANCE_REQUEST`;
export const REFRESH_BALANCE_SUCCESS = `${prefix}/REFRESH_BALANCE_SUCCESS`;
export const REFRESH_BALANCE_FAILURE = `${prefix}/REFRESH_BALANCE_FAILURE`;

export const refreshBalance = (publicKey: string) => ({
  types: [
    REFRESH_BALANCE_REQUEST,
    REFRESH_BALANCE_SUCCESS,
    REFRESH_BALANCE_FAILURE,
  ],
  promise: (api: Api) => api.fio.getBalance(publicKey),
  publicKey,
});
export const SET_BALANCES = `${prefix}/SET_BALANCES`;

export const setBalances = (balances: WalletsBalances) => ({
  type: SET_BALANCES,
  data: balances,
});

export const REFRESH_FIO_NAMES_REQUEST = `${prefix}/REFRESH_FIO_NAMES_REQUEST`;
export const REFRESH_FIO_NAMES_SUCCESS = `${prefix}/REFRESH_FIO_NAMES_SUCCESS`;
export const REFRESH_FIO_NAMES_FAILURE = `${prefix}/REFRESH_FIO_NAMES_FAILURE`;

export const refreshFioNames = (publicKey: string) => ({
  types: [
    REFRESH_FIO_NAMES_REQUEST,
    REFRESH_FIO_NAMES_SUCCESS,
    REFRESH_FIO_NAMES_FAILURE,
  ],
  promise: (api: Api) => api.fio.getFioNames(publicKey),
  publicKey,
});

export const RESET_FIO_NAMES = `${prefix}/RESET_FIO_NAMES`;

export const resetFioNames = () => ({
  type: RESET_FIO_NAMES,
});

export const IS_REGISTERED_REQUEST = `${prefix}/IS_REGISTERED_REQUEST`;
export const IS_REGISTERED_SUCCESS = `${prefix}/IS_REGISTERED_SUCCESS`;
export const IS_REGISTERED_FAILURE = `${prefix}/IS_REGISTERED_FAILURE`;

export const isRegistered = (fioAddress: string) => ({
  types: [IS_REGISTERED_REQUEST, IS_REGISTERED_SUCCESS, IS_REGISTERED_FAILURE],
  promise: async (api: Api) => {
    try {
      const { is_registered } = await api.fio.availCheck(fioAddress);
      return !!is_registered;
    } catch (e) {
      return false;
    }
  },
});

export const GET_FEE_REQUEST = `${prefix}/GET_FEE_REQUEST`;
export const GET_FEE_SUCCESS = `${prefix}/GET_FEE_SUCCESS`;
export const GET_FEE_FAILURE = `${prefix}/GET_FEE_FAILURE`;
export const SET_FEE = `${prefix}/SET_FEE`;

export const getFee = (endpoint: string, fioAddress: string = '') => ({
  types: [GET_FEE_REQUEST, GET_FEE_SUCCESS, GET_FEE_FAILURE],
  promise: (api: Api) => {
    return api.fio.publicFioSDK.getFee(endpoint, fioAddress);
  },
  endpoint,
});

export const setFees = (fees: { [endpoint: string]: FeePrice }) => ({
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
) => ({
  types: [
    GET_FIO_ADDRESSES_REQUEST,
    GET_FIO_ADDRESSES_SUCCESS,
    GET_FIO_ADDRESSES_FAILURE,
  ],
  promise: (api: Api) => api.fio.getFioAddresses(publicKey, limit, offset),
  publicKey,
});

export const GET_FIO_DOMAINS_REQUEST = `${prefix}/GET_FIO_DOMAINS_REQUEST`;
export const GET_FIO_DOMAINS_SUCCESS = `${prefix}/GET_FIO_DOMAINS_SUCCESS`;
export const GET_FIO_DOMAINS_FAILURE = `${prefix}/GET_FIO_DOMAINS_FAILURE`;

export const getFioDomains = (
  publicKey: string,
  limit: number,
  offset: number,
) => ({
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

export const getFioPubAddress = (fioAddress: string) => ({
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
) => ({
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
}) => ({
  types: [FIO_SIGNATURE_REQUEST, FIO_SIGNATURE_SUCCESS, FIO_SIGNATURE_FAILURE],
  promise: (api: Api) => {
    return api.fio.getNFTs(searchParams);
  },
  searchParams,
});

export const CLEAR_NFT_SIGNATURES = `${prefix}/CLEAR_NFT_SIGNATURES`;

export const clearNFTSignatures = () => ({
  type: CLEAR_NFT_SIGNATURES,
});

export const TOGGLE_TOKEN_LIST_INFO_BADGE = `${prefix}/TOGGLE_TOKEN_LIST_INFO_BADGE`;

export const toggleTokenListInfoBadge = (enabled: boolean) => ({
  type: TOGGLE_TOKEN_LIST_INFO_BADGE,
  enabled,
});

export const UPDATE_PUBLIC_ADDRESSES = `${prefix}/UPDATE_PUBLIC_ADDRESSES`;

export const updatePublicAddresses = (
  fioAddress: string,
  updPublicAddresses: {
    addPublicAddresses: PublicAddressDoublet[];
    deletePublicAddresses: PublicAddressDoublet[];
  },
) => ({
  type: UPDATE_PUBLIC_ADDRESSES,
  fioAddress,
  updPublicAddresses,
});
