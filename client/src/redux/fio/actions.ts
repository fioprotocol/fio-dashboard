import { PublicAddress } from '@fioprotocol/fiosdk/src/entities/PublicAddress';
import { NftItem } from '@fioprotocol/fiosdk/src/entities/NftItem';
import { Api } from '../../api';
import { PublicAddressDoublet, LinkActionResult } from '../../types';
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
  endpoint,
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

export const RESET_TRANSACTION_RESULT = `${prefix}/RESET_TRANSACTION_RESULT`;

export const resetTransactionResult = (actionName: string) => ({
  type: RESET_TRANSACTION_RESULT,
  data: actionName,
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
      api.fio.clearWalletFioSdk();
      return { ...result, newOwnerKey };
    } catch (e) {
      api.fio.clearWalletFioSdk();
      throw e;
    }
  },
  actionName: TRANSFER_REQUEST,
  fioName,
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
      api.fio.clearWalletFioSdk();
      return result;
    } catch (e) {
      api.fio.clearWalletFioSdk();
      throw e;
    }
  },
  actionName: SET_VISIBILITY_REQUEST,
  isPublic,
  fioDomain,
});

export const RENEW_REQUEST = `${prefix}/RENEW_REQUEST`;
export const RENEW_SUCCESS = `${prefix}/RENEW_SUCCESS`;
export const RENEW_FAILURE = `${prefix}/RENEW_FAILURE`;

export const renew = ({
  fioName,
  fee,
  keys,
}: {
  fioName: string;
  fee: number;
  keys: { public: string; private: string };
}) => ({
  types: [RENEW_REQUEST, RENEW_SUCCESS, RENEW_FAILURE],
  promise: async (api: Api) => {
    api.fio.setWalletFioSdk(keys);
    try {
      const result = await api.fio.renew(fioName, fee);
      api.fio.clearWalletFioSdk();
      return result;
    } catch (e) {
      api.fio.clearWalletFioSdk();
      throw e;
    }
  },
  actionName: RENEW_REQUEST,
  fioName,
});

export const LINK_TOKENS_REQUEST = `${prefix}/LINK_TOKENS_REQUEST`;
export const LINK_TOKENS_SUCCESS = `${prefix}/LINK_TOKENS_SUCCESS`;
export const LINK_TOKENS_FAILURE = `${prefix}/LINK_TOKENS_FAILURE`;

export const linkTokens = ({
  connectList,
  disconnectList,
  fioAddress,
  fee,
  keys,
}: {
  connectList: PublicAddressDoublet[];
  disconnectList: PublicAddressDoublet[];
  fioAddress: string;
  fee: number;
  keys: { public: string; private: string };
}) => ({
  types: [LINK_TOKENS_REQUEST, LINK_TOKENS_SUCCESS, LINK_TOKENS_FAILURE],
  promise: async (api: Api): Promise<LinkActionResult> => {
    api.fio.setWalletFioSdk(keys);
    const updatePubAddresses = async (
      publicAddresses: PublicAddressDoublet[],
      isConnection: boolean = true,
    ) => {
      let updatedConnections: PublicAddressDoublet[] = [];
      const iteration: { publicAddresses: PublicAddress[] } = {
        publicAddresses: [],
      };
      const limitPerCall = 5;
      for (const {
        chainCode: cCode,
        tokenCode: tCode,
        publicAddress,
      } of publicAddresses) {
        const chainCode = cCode.toUpperCase();
        const tokenCode = tCode.toUpperCase();

        iteration.publicAddresses.push({
          token_code: tokenCode,
          chain_code: chainCode,
          public_address: publicAddress,
        });
        if (iteration.publicAddresses.length === limitPerCall) {
          try {
            await api.fio.link(
              fioAddress,
              iteration.publicAddresses,
              fee,
              isConnection,
            );
            updatedConnections = [
              ...updatedConnections,
              ...iteration.publicAddresses.map(
                ({
                  token_code: tokenCode,
                  chain_code: chainCode,
                  public_address: publicAddress,
                }) => ({ chainCode, tokenCode, publicAddress }),
              ),
            ];
            iteration.publicAddresses = [];
          } catch (e) {
            return { updatedConnections, error: e };
          }
        }
      }

      if (iteration.publicAddresses.length) {
        try {
          await api.fio.link(
            fioAddress,
            iteration.publicAddresses,
            fee,
            isConnection,
          );
          updatedConnections = [
            ...updatedConnections,
            ...iteration.publicAddresses.map(
              ({
                token_code: tokenCode,
                chain_code: chainCode,
                public_address: publicAddress,
              }) => ({ chainCode, tokenCode, publicAddress }),
            ),
          ];
        } catch (e) {
          return { updatedConnections, error: e };
        }
      }

      return { updatedConnections };
    };

    try {
      const {
        updatedConnections,
        error: connectionError,
      } = await updatePubAddresses(connectList);
      const {
        updatedConnections: updatedDisconnections,
        error: disconnectionError,
      } = await updatePubAddresses(disconnectList, false);
      api.fio.clearWalletFioSdk();

      const connectionsFailed: PublicAddressDoublet[] = [];
      const disconnectionsFailed: PublicAddressDoublet[] = [];

      for (const connectItem of connectList) {
        if (
          updatedConnections.findIndex(
            ({ publicAddress }) => publicAddress === connectItem.publicAddress,
          ) < 0
        ) {
          connectionsFailed.push(connectItem);
        }
      }

      for (const disconnectItem of disconnectList) {
        if (
          updatedDisconnections.findIndex(
            ({ publicAddress }) =>
              publicAddress === disconnectItem.publicAddress,
          ) < 0
        ) {
          connectionsFailed.push(disconnectItem);
        }
      }

      return {
        connect: {
          updated: updatedConnections,
          failed: connectionsFailed,
          error: connectionError,
        },
        disconnect: {
          updated: updatedDisconnections,
          failed: disconnectionsFailed,
          error: disconnectionError,
        },
      };
    } catch (e) {
      api.fio.clearWalletFioSdk();
      throw e;
    }
  },
  actionName: LINK_TOKENS_REQUEST,
});

export const FIO_SIGNATURE_ADDRESS_REQUEST = `${prefix}/FIO_SIGNATURE_ADDRESS_REQUEST`;
export const FIO_SIGNATURE_ADDRESS_SUCCESS = `${prefix}/FIO_SIGNATURE_ADDRESS_SUCCESS`;
export const FIO_SIGNATURE_ADDRESS_FAILURE = `${prefix}/FIO_SIGNATURE_ADDRESS_FAILURE`;
export const FIO_SIGN_NFT_REQUEST = `${prefix}/FIO_SIGN_NFT_REQUEST`;
export const FIO_SIGN_NFT_SUCCESS = `${prefix}/FIO_SIGN_NFT_SUCCESS`;
export const FIO_SIGN_NFT_FAILURE = `${prefix}/FIO_SIGN_NFT_FAILURE`;

export const getSignaturesFromFioAddress = (fioAddress: string) => ({
  types: [
    FIO_SIGNATURE_ADDRESS_REQUEST,
    FIO_SIGNATURE_ADDRESS_SUCCESS,
    FIO_SIGNATURE_ADDRESS_FAILURE,
  ],
  promise: (api: Api) => {
    return api.fio.getNFTsFioAddress(fioAddress, 100, 0);
  },
  fioAddress,
});

export const singNFT = (publicKey: string, nftRequest: NftItem[]) => ({
  types: [FIO_SIGN_NFT_REQUEST, FIO_SIGN_NFT_SUCCESS, FIO_SIGN_NFT_FAILURE],
  promise: (api: Api) => {
    return api.fio.singNFT(publicKey, nftRequest, 100);
  },
  publicKey,
});
