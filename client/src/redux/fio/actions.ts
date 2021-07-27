import { Api } from '../../api';
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

export const GET_FEE_REQUEST = `${prefix}/GET_FEE_REQUEST`;
export const GET_FEE_SUCCESS = `${prefix}/GET_FEE_SUCCESS`;
export const GET_FEE_FAILURE = `${prefix}/GET_FEE_FAILURE`;

export const getFee = (endpoint: string, fioAddress: string = '') => ({
  types: [GET_FEE_REQUEST, GET_FEE_SUCCESS, GET_FEE_FAILURE],
  promise: (api: Api) => {
    api.fio.setBaseUrl();
    return api.fio.publicFioSDK.getFee(endpoint, fioAddress);
  },
  endpoint
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

export const TRANSFER_REQUEST = `${prefix}/TRANSFER_REQUEST`;
export const TRANSFER_SUCCESS = `${prefix}/TRANSFER_SUCCESS`;
export const TRANSFER_FAILURE = `${prefix}/TRANSFER_FAILURE`;

export const transfer = ({
  fioName,
  newOwnerFioAddress,
  newOwnerKey,
  fee,
  keys,
}: {
  fioName: string;
  newOwnerFioAddress?: string;
  newOwnerKey?: string;
  fee: number;
  keys: { public: string; private: string };
}) => ({
  types: [TRANSFER_REQUEST, TRANSFER_SUCCESS, TRANSFER_FAILURE],
  promise: async (api: Api) => {
    if (!newOwnerKey) {
      const {
        public_address: publicAddress,
      } = await api.fio.getFioPublicAddress(newOwnerFioAddress);
      if (!publicAddress) throw new Error('Public address is invalid.');
      newOwnerKey = publicAddress;
    }
    api.fio.setWalletFioSdk(keys);
    try {
      const result = await api.fio.transfer(fioName, newOwnerKey, fee);
      return result;
    } catch (e) {
      api.fio.clearWalletFioSdk();
      throw e;
    }
  },
});

export const SET_VISIBILITY_REQUEST = `${prefix}/SET_VISIBILITY_REQUEST`;
export const SET_VISIBILITY_SUCCESS = `${prefix}/SET_VISIBILITY_SUCCESS`;
export const SET_VISIBILITY_FAILURE = `${prefix}/SET_VISIBILITY_FAILURE`;

export const setDomainVisibility = ({
  fioDomain,
  isPublic,
  fee,
  keys,
}: {
  fioDomain: string;
  isPublic: boolean;
  fee: number;
  keys: { public: string; private: string };
}) => ({
  types: [
    SET_VISIBILITY_REQUEST,
    SET_VISIBILITY_SUCCESS,
    SET_VISIBILITY_FAILURE,
  ],
  promise: async (api: Api) => {
    api.fio.setWalletFioSdk(keys);
    try {
      const result = await api.fio.setDomainVisibility(
        fioDomain,
        isPublic,
        fee,
      );
      return result;
    } catch (e) {
      api.fio.clearWalletFioSdk();
      throw e;
    }
  },
});
