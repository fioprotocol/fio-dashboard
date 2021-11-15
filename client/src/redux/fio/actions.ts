import { PublicAddress } from '@fioprotocol/fiosdk/src/entities/PublicAddress';
import { Api } from '../../api';
import {
  PublicAddressDoublet,
  LinkActionResult,
  WalletKeys,
  NFTTokenDoublet,
} from '../../types';
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

export const resetTransactionResult = () => ({
  type: RESET_TRANSACTION_RESULT,
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

export const singNFT = (
  fioAddress: string,
  nftRequest: NFTTokenDoublet[],
  keys: WalletKeys,
) => ({
  types: [FIO_SIGN_NFT_REQUEST, FIO_SIGN_NFT_SUCCESS, FIO_SIGN_NFT_FAILURE],
  promise: async (api: Api) => {
    api.fio.setWalletFioSdk(keys);
    try {
      const result = await api.fio.singNFT(fioAddress, nftRequest);
      api.fio.clearWalletFioSdk();
      return result;
    } catch (e) {
      api.fio.clearWalletFioSdk();
      throw e;
    }
  },
  fioAddress,
  actionName: FIO_SIGN_NFT_REQUEST,
});
